"use client";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Compass,
  Loader,
  Luggage,
  Map,
  MapPinHouse,
  MoveRight,
  X,
} from "lucide-react";
import { YearPickerDropdown } from "./year-picker-dropdown";
import { useToast } from "@/hooks/use-toast";
import { getHistoricalData } from "@/server/actions";
import { MapPicker } from "./map-picker";

const formSchema = z.object({
  date: z.date(),
  latitude: z
    .number()
    .min(-90, "Latitude must be between -90° and 90°")
    .max(90, "Latitude must be between -90° and 90°"),
  longitude: z
    .number()
    .min(-180, "Longitude must be between -180° and 180°")
    .max(180, "Longitude must be between -180° and 180°"),
});

export default function NewStoryForm() {
  const [aiResponse, setAiResponse] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      latitude: 41,
      longitude: 12,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const { date, latitude, longitude } = values;
    const response = await getHistoricalData(date, latitude, longitude);
    if (!response)
      toast({
        title: "Error",
        description: "Failed to fetch data.",
        variant: "destructive",
      });
    else setAiResponse(response.toString());
    setLoading(false);
  }

  const getLocation = useCallback(() => {
    if ("geolocation" in navigator)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("latitude", position.coords.latitude);
          form.setValue("longitude", position.coords.longitude);
          toast({
            title: "Location",
            description: "Successfully fetched your location.",
          });
        },
        (error) => {
          toast({
            title: "Location",
            description: error.message,
            variant: "destructive",
          });
          console.error(error);
        },
      );
    else {
      toast({
        title: "Location",
        description: "Geolocation is not supported by your browser.",
      });
      console.error("Geolocation is not supported by your browser.");
    }
  }, [form, toast]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const latitude = form.watch("latitude");
  const longitude = form.watch("longitude");

  const isSubmitDisabled = !latitude || !longitude || loading;

  return (
    <div className="px-3 md:px-0">
      {!aiResponse && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 items-center justify-center"
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 text-center">
                  <FormLabel>Year you want to travel to</FormLabel>
                  <FormControl>
                    <YearPickerDropdown onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>
                    This is the year you are traveling to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2 w-full relative">
              {showMap && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="rounded-lg flex flex-col gap-4 w-[90vw] h-[90vh] md:w-[75vw] md:h-[75vh]">
                    <MapPicker
                      initialPosition={[latitude, longitude]}
                      onPositionChange={(lat, lng) => {
                        form.setValue("latitude", lat);
                        form.setValue("longitude", lng);
                      }}
                    />
                    <div className="w-full flex flex-col items-center justify-center gap-2">
                      <div className="flex gap-2">
                        <Button onClick={() => setShowMap(false)}>
                          Select <Compass />
                        </Button>
                        <Button onClick={() => setShowMap(false)}>
                          Close <X />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <p className="text-xs uppercase italic">
                          latitude: {latitude} (°N)
                        </p>
                        <p className="text-xs uppercase italic">
                          longitude: {longitude} (°E)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="40.7128"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Latitude of the location (°N).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="-74.0060"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Longitude of the location (°E).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2 items-center w-full">
                <div className="border-b w-full h-0" />
                <span className="text-xs">OR</span>
                <div className="border-b w-full h-0" />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={getLocation}
                  className="w-full"
                >
                  Get current location <MapPinHouse />
                </Button>
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => setShowMap((prev) => !prev)}
                  className="w-full"
                >
                  Choose on map <Map />
                </Button>
              </div>
            </div>
            <div className="w-full">
              <Button
                type="submit"
                disabled={isSubmitDisabled}
                className="w-full"
              >
                {loading ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <Luggage />
                    <span>Start Journey</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
      {aiResponse && (
        <div
          className="flex flex-col md:px-10 lg:px-20 xl:px-32 2xl:px-64
         gap-4 py-12"
        >
          <p className="text-lg">
            <span className="text-6xl">{aiResponse?.at(0)?.toUpperCase()}</span>
            <span>{aiResponse.slice(1)}</span>
          </p>
          <Button onClick={() => setAiResponse("")}>
            New Story <MoveRight />
          </Button>
        </div>
      )}
    </div>
  );
}

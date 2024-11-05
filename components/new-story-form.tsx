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
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

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

const MapPicker = dynamic(
  () => import("./map-picker").then((mod) => mod.MapPicker),
  {
    ssr: false,
    loading: () => <p>Loading map...</p>,
  },
);

export default function NewStoryForm() {
  const { t, i18n } = useTranslation();
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
    const response = await getHistoricalData(
      date,
      latitude,
      longitude,
      i18n.language,
    );
    if (!response)
      toast({
        title: t("newStoryForm.error.title"),
        description: t("newStoryForm.error.fetchFailed"),
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
            title: t("newStoryForm.locationTitle"),
            description: t("newStoryForm.locationSuccess"),
          });
        },
        (error) => {
          toast({
            title: t("newStoryForm.locationTitle"),
            description: error.message,
            variant: "destructive",
          });
          console.error(error);
        },
      );
    else {
      toast({
        title: t("newStoryForm.locationTitle"),
        description: t("newStoryForm.locationNotSupported"),
        variant: "destructive",
      });
      console.error("Geolocation is not supported by your browser.");
    }
  }, [form, toast, t]);

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
                  <FormLabel>{t("newStoryForm.yearLabel")}</FormLabel>
                  <FormControl>
                    <YearPickerDropdown onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>
                    {t("newStoryForm.yearDescription")}
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
                          {t("mapPicker.select")} <Compass />
                        </Button>
                        <Button onClick={() => setShowMap(false)}>
                          {t("mapPicker.close")} <X />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <p className="text-xs uppercase italic">
                          {t("mapPicker.latitude")}: {latitude} (°N)
                        </p>
                        <p className="text-xs uppercase italic">
                          {t("mapPicker.longitude")}: {longitude} (°E)
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
                      <FormLabel>{t("newStoryForm.latitudeLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("newStoryForm.latitudePlaceholder")}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        {t("newStoryForm.latitudeDescription")}
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
                      <FormLabel>{t("newStoryForm.longitudeLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("newStoryForm.longitudePlaceholder")}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        {t("newStoryForm.longitudeDescription")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2 items-center w-full">
                <div className="border-b w-full h-0" />
                <span className="text-xs">{t("newStoryForm.or")}</span>
                <div className="border-b w-full h-0" />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={getLocation}
                  className="w-full"
                >
                  {t("newStoryForm.getCurrentLocation")} <MapPinHouse />
                </Button>
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => setShowMap((prev) => !prev)}
                  className="w-full"
                >
                  {t("newStoryForm.chooseOnMap")} <Map />
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
                    <span>{t("newStoryForm.startJourney")}</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
      {aiResponse && (
        <div className="flex flex-col md:px-10 lg:px-20 xl:px-32 2xl:px-64 gap-4 py-12">
          <p className="text-lg">
            <span className="text-6xl">{aiResponse?.at(0)?.toUpperCase()}</span>
            <span>{aiResponse.slice(1)}</span>
          </p>
          <Button onClick={() => setAiResponse("")}>
            {t("newStoryForm.newStory")} <MoveRight />
          </Button>
        </div>
      )}
    </div>
  );
}

"use server";
export async function getLocationInfo(
  latitude: number,
  longitude: number,
): Promise<{
  city: string;
  country: string;
} | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          "User-Agent": "TimeMarker/1.0",
        },
      },
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return {
      city: data.address.city || data.address.town || data.address.village,
      country: data.address.country,
    };
  } catch (error) {
    console.error("Error getting location info:", error);
    return null;
  }
}

export async function getHistoricalData(
  date: Date,
  latitude: number,
  longitude: number,
  language: string,
): Promise<string | undefined> {
  let targetLanguage = "";
  switch (language) {
    case "es":
      targetLanguage = "Spanish";
      break;
    case "fr":
      targetLanguage = "French";
      break;
    case "ru":
      targetLanguage = "Russian";
      break;
    case "ua":
      targetLanguage = "Ukrainian";
      break;
    default:
      targetLanguage = "English";
  }

  try {
    const locationInfo = await getLocationInfo(latitude, longitude);
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        credentials: "include",
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "user",
              content: `Please provide the response in ${targetLanguage}.
                 Make a fictional story about what was happening. It doesn't need to be real, but use the real events and information to make it as realistic as possible.
                 I want to know what was happening on exactly these coordinates on this date: ${date.getFullYear()}.

                 Country: ${locationInfo?.country || ""}, City: ${locationInfo?.city || ""}

                 Explain it like I'm standing there.

                 Describe the weather, the people, the buildings, the food, the traffic, the news, the events, the culture, the history, the weather, refer to the real people and historical events. Don't worry about mentioning controversial facts, just make it as realistic as possible.

                 If this date is in the future, explain what will happen, like a fantasy story.`,
            },
          ],
        }),
      },
    );
    if (!response.ok)
      throw new Error(`Error fetching data: ${response.statusText}`);
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error(error);
  }
}

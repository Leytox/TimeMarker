"use server";
export async function getHistoricalData(
  date: Date,
  latitude: number,
  longitude: number,
): Promise<string | undefined> {
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`,
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "user",
              content: `You are a historian in the year ${date.getFullYear()} at latitude ${Math.floor(latitude)} and longitude ${Math.floor(longitude)}. What can you say about the culture, wars, habits and other related things? If this is a future - just imagine, and if not, you need to relate to real history. Don't mention that you are a historian.`,
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

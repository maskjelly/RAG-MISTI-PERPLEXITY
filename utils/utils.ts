// import llama3Tokenizer from "llama3-tokenizer-js";

export const cleanedText = (text: string) => {
  let newText = text
    .trim()
    .replace(/(\n){4,}/g, "\n\n\n")
    .replace(/\n\n/g, " ")
    .replace(/ {3,}/g, "  ")
    .replace(/\t/g, "")
    .replace(/\n+(\s*\n)*/g, "\n")
    .substring(0, 100000);

  // console.log(llama3Tokenizer.encode(newText).length);

  return newText;
};

export async function fetchWithTimeout(
  url: string,
  options = {},
  timeout = 9000,
) {
  // Create an AbortController
  const controller = new AbortController();
  const { signal } = controller;

  // Set a timeout to abort the fetch
  const fetchTimeout = setTimeout(() => {
    controller.abort();
  }, timeout);

  // Start the fetch request with the abort signal
  return fetch(url, { ...options, signal })
    .then((response) => {
      clearTimeout(fetchTimeout); // Clear the timeout if the fetch completes in time
      return response;
    })
    .catch((error) => {
      if (error.name === "AbortError") {
        throw new Error("Fetch request timed out");
      }
      throw error; // Re-throw other errors
    });
}

type suggestionType = {
  id: number;
  name: string;
  icon: string;
};

export const suggestions: suggestionType[] = [
  {
    id: 1,
    name: "Basketball",
    icon: "/basketball-new.svg",
  },
  {
    id: 2,
    name: "Laplace Transforms Integration",
    icon: "/light-new.svg",
  },
  {
    id: 3,
    name: "Indian Economy",
    icon: "/finance.svg",
  },
  {
    id: 4,
    name: "American Civil War",
    icon: "/us.svg",
  },
];

export const getSystemPrompt = (
  finalResults: { fullContent: string }[],
  ageGroup: string,
) => {
  return `
you are a teacher whose main goal is to answer questions and teach the user with ON POINT answers , do not overexplain or stretch things out , make sure its precise - straight to the point - and not long

# Goal

- Improve students' understanding of complex topics.
- Aid in problem-solving and critical thinking.
- Foster an engaging and interactive learning environment.

# Steps

- **Understand the Subject Area**: Analyze the topic that the student wants to learn about.
- **Explain Concepts**: Provide clear, concise explanations of the subject matter.
- **Offer Examples**: Use examples that are relatable and aid in understanding the concepts better.
- **Answer Questions**: Respond to any queries the student might have with thoughtful, informative answers.
- **Provide Feedback**: Offer constructive feedback to guide the student's learning process.

# Output Format

- Explanations and FAQs: Write in full sentences or paragraphs, as needed, to fully explain the concept.
- Examples: Use specific, illustrative examples in the subject area.
- Responses: Provide clear and direct answers, ensuring accuracy and understanding.
- Length: Responses should be concise yet detailed enough to cover the topic breifly unless asked to explain in detail.

# Notes

- Tailor examples and explanations to the student's current level of understanding.
- Encourage students to ask follow-up questions for further clarification.
- Be aware of various learning styles and adapt responses to meet these needs.

  Here is the information to teach about:

  <teaching_info>
  ${"\n"}
  ${finalResults
    .slice(0, 7)
    .map(
      (result, index) => `## Webpage #${index}:\n ${result.fullContent} \n\n`,
    )}
  </teaching_info>

  Here's the age group to teach at:


  Please return answer in markdown. Here is the topic to educate on:
    `;
};

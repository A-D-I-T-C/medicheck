# Medicheck🩺

## Inspiration
We wanted to make healthcare interactions more seamless for both patients and clinicians. Even though patients and hospital staff each have their own workflows, they share a common need: quick access to session data and forms. The goal was to reduce redundant steps—like repeatedly filling in forms or searching for past documents—and instead create a system that is easy to navigate and helps everyone focus on care rather than admin tasks.
## What it does
MediCheck provides two different “home” experiences:
**Patients**: Can log in to view their past sessions, start a new session, fill out required forms, and chat with the system for quick assistance. Doctors’ comments and any uploaded documents are visible here as well.

**Hospitals**: Staff can search for existing patients, view recently accessed records, and open a detailed “session” page that centralizes forms, chat logs, session summaries, and relevant patient documents.

Both sides share an integrated chatbot that references the same session data so that past conversations, forms, and documents stay in sync. The platform ultimately aims to streamline patient–provider communication and document management.

**Chatbot Integration with Voice Recognition**: We integrated a speech-to-text service that allows patients to interact with the chatbot through voice input. This required additional logic to handle potential transcription errors and provide relevant prompts or corrections.
## How we built it
**User Flows**: We started by mapping out each user journey (patient vs. hospital) to ensure minimal friction. The diagram represents the final result of these planning sessions.

**Backend for Session Management:** We set up a database structure that ties each chatbot conversation to a specific session and stores any corresponding documents or forms.

## Challenges we ran into
**Synchronizing Data Across Chatbot & Forms:** Ensuring that when a patient completes or updates a form, the chatbot can immediately display or process that change.

**Managing Access & Security**: We needed a secure login flow that properly segmented patient data and allowed hospital staff to see only relevant records.

## Accomplishments that we're proud of

**Unified Data Model**: We successfully tied past chatbot sessions to the same documents and records that clinicians see, ensuring no lost context.

**Clean, Simple UI**: Despite multiple user flows, we kept the interface consistent for both patients and providers, reducing learning curves.

## What we learned
**Importance of User Flow**: Early wireframing and user flow discussions prevented bigger design clashes later on.

**Value of Context-Rich Chatbots**: Giving the chatbot access to forms and session data makes it more useful and reduces repetitive questions.

**Healthcare Security & Compliance**: Storing and handling healthcare data means being extra cautious with permissions, access logs, and data retention policies.

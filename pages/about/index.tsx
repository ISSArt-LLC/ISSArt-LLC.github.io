import { marked } from "marked";
import React from "react";

const content = `
## Write for us!

Our blog updates are sent to small and midsize business owners, startup founders and C-level executives, who are among our subscribers.

We accept articles and blog posts from technology experts and writers  **(native English speakers)**  preferably in the following areas:

-   Machine Learning
-   Natural Language Processing
-   Computer Vision
-   Web&Mobile Development

We reserve the right to refuse to accept a request for a guest posting or publish an article at our sole discretion.

### Copy requirements

-   Your article should be original – not previously published somewhere else.
-   Your article shouldn’t be a promotional material for your company or organization.
-   An article should have 1000-1500 words.
-   Your article must have a well written introduction and a conclusion.
-   Your article must be free of any grammatical errors or typos.
-   Any statement you make in your article must include the linked source. We will check for source reliability.
-   Include visual aid images like charts, diagrams, or relevant images in your article.
-   Please include all image copyrights and permissions for use and cite the source.
-   Include a short author biography and your picture. Your bio can include a link to your website.

**Please send your article suggestions to  [crm@issart.com](mailto:crm@issart.com).**

Start your subject line with GUEST POST.
`

const About = () => {
  return (
    <React.Fragment>
      <div className='post-body p-5 m-auto' dangerouslySetInnerHTML={{ __html: marked.parse(content) }}></div>
    </React.Fragment>
  );
};
export default About;

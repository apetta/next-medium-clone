export default {
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "approved",
      title: "Approved?",
      type: "boolean",
      description: "Is this comment approved?",
    },
    {
      name: "email",
      title: "Email",
      type: "string",
    },
    {
      name: "post",
      type: "reference",
      to: [{ type: "post" }],
    },
    {
      name: "comment",
      title: "Comment",
      type: "string",
    },
  ],
};

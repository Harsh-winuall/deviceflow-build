export type Workflow = {
  _id: string;
  userId: string;
  name: string;
  description: string | null;
  definition: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

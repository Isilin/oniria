import { Prisma } from '@prisma/client';

export type TeamWithMembers = Prisma.TeamGetPayload<{
  include: { members: true };
}>;

-- Ensure every workspace creator has the owner role in its membership row.
UPDATE "WorkspaceMember" AS member
SET "role" = 'OWNER'
FROM "Workspace" AS workspace
WHERE member."workspaceId" = workspace."id"
  AND member."userId" = workspace."ownerId"
  AND member."role" <> 'OWNER';
ALTER TABLE "class" DROP CONSTRAINT "class_primary_instructor_id_studio_instructor_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL;
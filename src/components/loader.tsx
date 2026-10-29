import { Spinner } from "@/components/ui/spinner";

export function Loader() {
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <Spinner className="size-10 text-primary" />
    </div>
  );
}

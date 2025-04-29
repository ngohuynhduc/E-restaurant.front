import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ButtonInteract } from "@/components/ui/interactButton";
import { XIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export const RequestLogin = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader className="flex flex-row justify-between">
          <DialogTitle>Chưa đăng nhập</DialogTitle>
          <span className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <XIcon />
          </span>
        </DialogHeader>
        <DialogDescription className="mt-2 flex flex-col items-center">
          <span className="text-xl font-semibold">
            Bạn chưa đăng nhập, đăng nhập ngay để đặt bàn?
          </span>
          <ButtonInteract
            className="mt-4"
            onClick={() => router.push(`/auth/login?callbackUrl=${pathname ?? "/"}`)}
          >
            Đăng nhập ngay
          </ButtonInteract>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

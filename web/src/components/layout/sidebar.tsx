import {
  ChatBubbleIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useStore } from "@nanostores/react";
import {
  $showAddPost,
  $showAddComment,
  toggleAddPost,
  toggleAddComment,
} from "@/lib/store";
import { $router } from "@/lib/router";
import { openPage } from "@nanostores/router";
import useAuth from "@/hooks/use-auth";
import { toast } from "../ui/use-toast";

const Sidebar = () => {
  const page = useStore($router);
  const showAddPost = useStore($showAddPost);
  const showAddComment = useStore($showAddComment);
  const { user } = useAuth();

  const authGuard = () => {
    if (user && user.username) {
      return true;
    }
    toast({
      variant: "destructive",
      title: "Sorry! You need to sign in 🙁",
      description: "To create a post or comment, you must register and sign in.",
    });
    return false;
  }

  // Look here 👇
  const navigateHome = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openPage($router, "home");
  };

  if (!page) return null;

  return (
    <div className="flex flex-col items-end p-2 space-y-2">
      <Button
        aria-label={"Home"}
        variant="ghost"
        size="icon"
        onClick={navigateHome} // 👈 look here
      >
        <HomeIcon className="w-5 h-5" />
      </Button>
      <Button aria-label={"Search"} variant="ghost" size="icon">
        <MagnifyingGlassIcon className="w-5 h-5" />
      </Button>
      {page.route === "home" && !showAddPost && (
        <Button
          aria-label={"Make a Post"}
          variant="default"
          size="icon"
          onClick={() => {
            authGuard() && toggleAddPost();
          }}
        >
          <PlusCircledIcon className="w-5 h-5" />
        </Button>
      )}
      {page.route === "post" && !showAddComment && (
        <Button
          aria-label={"Make a Comment"}
          variant="default" // 👈 look here
          size="icon"
          onClick={() => {
            authGuard() && toggleAddComment();
          }}
        >
          <ChatBubbleIcon className="w-5 h-5" /> {/* 👈 look here */}
        </Button>
      )}
    </div>
  );
};

export default Sidebar;

import React, { useState } from "react";
import { FaComments } from "react-icons/fa6";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RouteSignIn } from "@/helpers/RouteName";
import CommentList from "./CommentList";

const Comment = ({ props, onNewComment }) => {
  const user = useSelector((state) => state.user);
  const [newComment, setNewComment] = useState();

  const formSchema = z.object({
    comment: z.string().min(3, "Comment must be at least 3 characters long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  async function onSubmit(values) {
    try {
      const newValues = {
        ...values,
        blogid: props.blogid,
        user: user.user._id,
      };

      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/comment/add`,
        {
          method: "post",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newValues),
        }
      );

      const data = await response.json();
      if (!response.ok) return showToast("error", data.message);

      setNewComment(data.comment);
      form.reset();
      showToast("success", data.message);

      // 🔥 Notify parent component
      if (onNewComment) onNewComment(data.comment);
    } catch (error) {
      showToast("error", error.message);
    }
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md max-w-4xl mx-auto">
      <h4 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-4">
        <FaComments className="text-violet-500" /> Comments
      </h4>

      {user && user.isLoggedIn ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold text-base">
                    Comment
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your comment..."
                      {...field}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-200 text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="bg-violet-500 hover:bg-violet-600 text-white font-semibold px-6 py-3 rounded-lg text-base transition-colors duration-200"
            >
              Submit
            </Button>
          </form>
        </Form>
      ) : (
        <Button
          asChild
          className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg text-base transition-colors duration-200"
        >
          <Link to={RouteSignIn}>Sign In</Link>
        </Button>
      )}

      <div className="mt-6">
        <CommentList props={{ blogid: props.blogid, newComment }} />
      </div>
    </div>
  );
};

export default Comment;

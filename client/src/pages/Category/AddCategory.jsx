import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import { useNavigate } from "react-router-dom";    // added
import { RouteCategoryDetails } from "@/helpers/RouteName";   // added

const AddCategory = () => {
  const navigate = useNavigate();  // added

  const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    slug: z.string().min(3, "Slug must be at least 3 characters long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const categoryName = form.watch("name");

  useEffect(() => {
    if (categoryName) {
      const slug = slugify(categoryName, { lower: true });
      form.setValue("slug", slug);
    }
  }, [categoryName]);

  async function onSubmit(values) {
    try {
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/category/add`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();
      if (!response.ok) return showToast("error", data.message);

      form.reset();
      showToast("success", data.message);
      navigate(RouteCategoryDetails); // added
    } catch (error) {
      showToast("error", error.message);
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card className="pt-5 max-w-2xl mx-auto">
        <CardContent>
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Add Category
          </h1>
          <Form {...form}>
            <form
              className="space-y-6 flex flex-col"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter category name"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="Slug" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full md:w-auto bg-violet-500 hover:bg-violet-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategory;

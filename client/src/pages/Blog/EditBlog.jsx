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
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useFetch";
import Dropzone from "react-dropzone";
import Editor from "@/components/Editor";
import { useNavigate, useParams } from "react-router-dom";
import { RouteBlog } from "@/helpers/RouteName";
import { decode } from "entities";
import Loading from "@/components/Loading";

const EditBlog = () => {
  const { blogid } = useParams();
  const navigate = useNavigate();

  const [filePreview, setFilePreview] = useState();
  const [file, setFile] = useState();

  if (!blogid) return <p>Blog ID is missing!</p>;

  const { data: categoryData } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/category/all-category`,
    { method: "get", credentials: "include" }
  );

  const { data: blogData, loading: blogLoading } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/edit/${blogid}`,
    { method: "get", credentials: "include" },
    [blogid]
  );

  const formSchema = z.object({
    category: z.string().min(3),
    title: z.string().min(3),
    slug: z.string().min(3),
    blogContent: z.string().min(3),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      title: "",
      slug: "",
      blogContent: "",
    },
  });

  useEffect(() => {
    if (blogData?.blog) {
      const blog = blogData.blog;
      setFilePreview(blog.featuredImage);
      form.setValue("category", blog.category._id);
      form.setValue("title", blog.title);
      form.setValue("slug", blog.slug);
      form.setValue("blogContent", decode(blog.blogContent));
    }
  }, [blogData]);

  const blogTitle = form.watch("title");

  useEffect(() => {
    if (blogTitle) form.setValue("slug", slugify(blogTitle, { lower: true }));
  }, [blogTitle]);

  const handleEditorData = (event, editor) => {
    form.setValue("blogContent", editor.getData());
  };

  const handleFileSelection = (files) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
  };

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("data", JSON.stringify(values));
      formData.append("params[blogid]", blogid);

      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/blog/update/${blogid}`,
        {
          method: "put",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) return showToast("error", data.message);

      showToast("success", data.message);
      navigate(RouteBlog);
    } catch (error) {
      showToast("error", error.message);
    }
  };

  if (blogLoading) return <Loading />;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card className="pt-5 max-w-4xl mx-auto">
        <CardContent>
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Blog</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 flex flex-col"
            >
              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryData?.category?.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter title"
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

              {/* Featured Image */}
              <div className="mb-3">
                <span className="mb-2 block font-medium text-gray-700">
                  Featured Image
                </span>
                <Dropzone onDrop={handleFileSelection}>
                  {({ getRootProps, getInputProps }) => (
                    <div
                      {...getRootProps()}
                      className="flex justify-center items-center w-full md:w-48 h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-violet-400 transition-all duration-200 overflow-hidden"
                    >
                      <input {...getInputProps()} />
                      {filePreview ? (
                        <img
                          src={filePreview}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <p className="text-gray-400">Drop file here</p>
                      )}
                    </div>
                  )}
                </Dropzone>
              </div>

              {/* Editor */}
              <FormField
                control={form.control}
                name="blogContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blog Content</FormLabel>
                    <FormControl>
                      <Editor
                        props={{
                          initialData: field.value,
                          onChange: handleEditorData,
                        }}
                      />
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

export default EditBlog;

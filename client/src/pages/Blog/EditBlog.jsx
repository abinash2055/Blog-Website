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
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RouteBlog } from "@/helpers/RouteName";
import { decode } from "entities";
import Loading from "@/components/Loading";

const EditBlog = () => {
  const { blogid } = useParams();
  const navigate = useNavigate();

  const [filePreview, setFilePreview] = useState();
  const [file, setFile] = useState();

  if (!blogid) return <p>Blog ID is missing!</p>; // Safety check

  // Fetch categories
  const { data: categoryData } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/category/all-category`,
    { method: "get", credentials: "include" }
  );

  // Fetch blog details
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

  // Populate form when blogData loads
  useEffect(() => {
    if (blogData && blogData.blog) {
      const blog = blogData.blog;
      setFilePreview(blog.featuredImage);
      form.setValue("category", blog.category._id);
      form.setValue("title", blog.title);
      form.setValue("slug", blog.slug);
      form.setValue("blogContent", decode(blog.blogContent));
    }
  }, [blogData]);

  const handleEditorData = (event, editor) => {
    const data = editor.getData();
    form.setValue("blogContent", data);
  };

  const blogTitle = form.watch("title");
  useEffect(() => {
    if (blogTitle) {
      form.setValue("slug", slugify(blogTitle, { lower: true }));
    }
  }, [blogTitle]);

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
      formData.append("params[blogid]", blogid); // Send blogid to backend

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
      navigate(RouteBlog); // Redirect after success
    } catch (error) {
      showToast("error", error.message);
    }
  };

  if (blogLoading) return <Loading />;

  return (
    <Card className="pt-5">
      <CardContent>
        <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
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
                <FormItem className="mb-3">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
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
                <FormItem className="mb-3">
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="Slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Featured Image */}
            <div className="mb-3">
              <span className="block mb-2">Featured Image</span>
              <Dropzone onDrop={handleFileSelection}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className="flex justify-center items-center w-36 h-28 border-2 border-dashed rounded">
                      {filePreview && <img src={filePreview} alt="Preview" />}
                    </div>
                  </div>
                )}
              </Dropzone>
            </div>

            {/* Blog Content */}
            <FormField
              control={form.control}
              name="blogContent"
              render={({ field }) => (
                <FormItem className="mb-3">
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

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditBlog;

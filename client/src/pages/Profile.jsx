import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useFetch } from "@/hooks/useFetch";
import Loading from "@/components/Loading";
import { IoCameraOutline } from "react-icons/io5";
import Dropzone from "react-dropzone";
import { setUser } from "@/redux/user/user.slice";
import { FaRegArrowAltCircleUp } from "react-icons/fa";

const Profile = () => {
  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const userId = user?.user?._id;

  // Fetch user data only when userId is available
  const {
    data: userData,
    loading,
    error,
  } = useFetch(
    userId ? `${getEnv("VITE_API_BASE_URL")}/user/get-user/${userId}` : null,
    {
      method: "get",
      credentials: "include",
    }
  );

  // Form validation schema
  const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long."),
    email: z.string().email(),
    bio: z.string().min(3, "Bio must be at least 3 characters long."),
    password: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      password: "",
    },
  });

  // Reset form when user data is fetched
  useEffect(() => {
    if (userData && userData.success) {
      form.reset({
        name: userData.user.name,
        email: userData.user.email,
        bio: userData.user.bio,
        password: "",
      });
      setFilePreview(userData.user.avatar || null);
    }
  }, [userData]);

  // Handle file selection
  const handleFileSelection = (files) => {
    const file = files[0];
    setFile(file);
    setFilePreview(URL.createObjectURL(file));
  };

  // Form submission
  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("data", JSON.stringify(values));

      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/user/update-user/${userId}`,
        {
          method: "put",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        return showToast("error", data.message);
      }

      dispatch(setUser(data.user));
      showToast("success", data.message);
    } catch (err) {
      showToast("error", err.message);
    }
  };

  if (loading) return <Loading />;

  return (
    <Card className="max-w-screen-md mx-auto">
      <CardContent>
        {/* Avatar Upload */}
        <div className="flex justify-center items-center mt-10">
          <Dropzone onDrop={handleFileSelection}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Avatar className="w-28 h-28 relative group bg-white border-4 border-black">
                  <AvatarImage src={filePreview || "/default-avatar.png"} />
                  <div className="absolute z-50 w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center bg-black bg-opacity-20 border-2 border-violet-500 rounded-full group-hover:flex hidden cursor-pointer">
                    <IoCameraOutline color="#7c3aed" />
                  </div>
                </Avatar>
              </div>
            )}
          </Dropzone>
        </div>

        <div className="flex flex-col items-center justify-center mt-3">
          <FaRegArrowAltCircleUp className="text-blue-500 text-3xl mb-2" />
          <span className="text-gray-700 text-lg font-medium text-center">
            Click on the circle above to change your profile image
          </span>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your bio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Profile;

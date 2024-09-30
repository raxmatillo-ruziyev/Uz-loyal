import React, { useEffect, useState } from 'react';
import { Button, Image, message, Table, Modal, Form, Input, Upload, Popconfirm } from "antd";

const Blog = () => {
  const [form] = Form.useForm();
  const blogUrl = 'https://api.dezinfeksiyatashkent.uz/api/blogs';
  const imageURL = "https://api.dezinfeksiyatashkent.uz/api/uploads/images/";
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const token = localStorage.getItem("access_token");

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  // GET
  const getData = () => {
    setLoader(true);
    fetch(blogUrl)
      .then((res) => res.json())
      .then((data) => {
        setData(data.data || []); // Agar data.data bo'lmasa, bo'sh massiv qaytaradi
      })
      .catch((err) => message.error(err))
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    getData();
  }, []);

  // POST yoki PUT (Yaratish yoki Tahrirlash)
  const [postTitle, setPostTitle] = useState('');
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [author, setAuthor] = useState('');

  const handleFormSubmit = () => {
    // Kiritilgan maydonlarni tekshirish
    if (!postTitle || !postText || !author) {
      message.error("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    const formData = new FormData();
    formData.append('title_uz', postTitle); // title_uz
    formData.append('text_uz', postText); // text_uz
    formData.append('author', author); // author
    if (postImage) {
      formData.append('images', postImage);
    }

    const url = isEditMode ? `${blogUrl}/${currentBlog.id}` : blogUrl;
    const method = isEditMode ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        getData();
        setIsModalOpen(false);
        message.success(data.message);
        resetForm(); // Formani tozalash
      })
      .catch((err) => message.error("Xatolik yuz berdi!"));
  };

  // Formani tozalash
  const resetForm = () => {
    setPostImage(null);
    setPostTitle('');
    setPostText('');
    setAuthor('');
    form.resetFields();
  };

  // DELETE
  const deleteData = (id) => {
    fetch(`${blogUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          getData();
          message.success(data.message);
        } else {
          message.error(data.message);
        }
      })
      .catch((err) => message.error("Xatolik yuz berdi!"));
  };

  const handleAdd = () => {
    setIsEditMode(false);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (blog) => {
    if (!blog) return; // Agar blog bo'lmasa, chiqish

    setIsEditMode(true);
    setCurrentBlog(blog);
    setPostTitle(blog.title_uz);
    setPostText(blog.text_uz);
    setAuthor(blog.author);
    setPostImage(null); // Yangi rasm yuklash uchun tozalash
    setIsModalOpen(true);
    form.setFieldsValue({
      title_uz: blog.title_uz,
      text_uz: blog.text_uz,
      author: blog.author,
    });
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Title",
      dataIndex: "title_uz",
      key: "title_uz",
    },
    {
      title: "Text",
      dataIndex: "text_uz",
      key: "text_uz",
    },
    {
      title: "Images",
      dataIndex: "image",
      key: "image",
      render: (text, blog) => (
        <Image
          width={110}
          height={90}
          src={blog?.blog_images?.[0]?.image?.src ? `${imageURL}${blog.blog_images[0].image.src}` : "default_image_url.jpg"}
          alt={blog.title_uz}
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: (
        <Button type="primary" onClick={handleAdd}>
          Add Blog
        </Button>
      ),
      dataIndex: "add-blog",
      key: "add-blog",
    },
  ];

  const dataSource =
    data &&
    data.map((blog, index) => ({
      index: index + 1,
      key: blog.id,
      title_uz: blog.title_uz,
      text_uz: blog.text_uz,
      blog_images: blog.blog_images, // Blog rasmlari uchun qo'shimcha ma'lumot
      image: (
        <Image
          width={110}
          height={90}
          src={blog?.blog_images?.[0]?.image?.src ? `${imageURL}${blog.blog_images[0].image.src}` : "default_image_url.jpg"}
          alt={blog.title_uz}
        />
      ),
      action: (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="primary" onClick={() => handleEdit(blog)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete the blog"
            description="Are you sure to delete this blog?"
            onConfirm={() => deleteData(blog.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    }));

  return (
    <div>
      <h1>Blog</h1>
      <div>
        <section id="blogs">
          <Table
            loading={loader}
            dataSource={dataSource}
            columns={columns}
            pagination={{ pageSize: 5 }}
          />

          {/* Modal for Add and Edit */}
          <Modal
            title={isEditMode ? "Edit Blog" : "Add Blog"}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
          >
            <Form
              form={form}
              name="basic"
              style={{ maxWidth: 600 }}
              layout="vertical"
              onFinish={handleFormSubmit}
              initialValues={{
                title_uz: postTitle,
                text_uz: postText,
                author: author,
              }}
            >
              <Form.Item
                label="Title"
                name="title_uz"
                rules={[{ required: true, message: "Iltimos, blog sarlavhasini kiriting!" }]}
              >
                <Input onChange={(e) => setPostTitle(e.target.value)} value={postTitle} />
              </Form.Item>
              <Form.Item
                label="Text"
                name="text_uz"
                rules={[{ required: true, message: "Iltimos, blog matnini kiriting!" }]}
              >
                <Input onChange={(e) => setPostText(e.target.value)} value={postText} />
              </Form.Item>
              <Form.Item
                label="Author"
                name="author"
                rules={[{ required: true, message: "Iltimos, muallifni kiriting!" }]}
              >
                <Input onChange={(e) => setAuthor(e.target.value)} value={author} />
              </Form.Item>
              <Form.Item label="Image" name="image" valuePropName="fileList" getValueFromEvent={normFile}>
                <Upload
                  accept="image/*"
                  listType="picture-card"
                  onChange={(e) => {
                    const file = e.file.originFileObj;
                    if (file) setPostImage(file);
                  }}
                >
                  <div>Upload</div>
                </Upload>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  {isEditMode ? "Save Changes" : "Add Blog"}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </section>
      </div>
    </div>
  );
};

export default Blog;

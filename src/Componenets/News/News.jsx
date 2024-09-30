import { Button, Flex, Image, message, Table, Modal, Form, Input, Upload, Popconfirm } from "antd";
import { useEffect, useState } from "react";

function News() {
  const [form] = Form.useForm();
  const newsURL = "https://api.dezinfeksiyatashkent.uz/api/news";
  const imageURL = "https://api.dezinfeksiyatashkent.uz/api/uploads/images/";
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [postTitleUz, setPostTitleUz] = useState("");
  const [postTextUz, setPostTextUz] = useState("");
  const [postAuthor, setPostAuthor] = useState("");
  const [postImage, setPostImage] = useState(null);
  const token = localStorage.getItem("access_token");

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // GET
  const getData = () => {
    setLoader(true);
    fetch(newsURL)
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
        console.log("Image", data?.data);
      })
      .catch((err) => message.error(err))
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    getData();
  }, []);

  // POST yoki PUT
  const handleFormSubmit = () => {
    const formData = new FormData();
    formData.append("title_en", postTitle);
    formData.append("text_en", postText);
    formData.append("title_uz", postTitleUz);
    formData.append("text_uz", postTextUz);
    formData.append("author", postAuthor);
    if (postImage) {
      formData.append("images", postImage);
    }

    const url = isEditMode ? `${newsURL}/${currentNews.id}` : newsURL;
    const method = isEditMode ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          getData();
          setIsModalOpen(false);
          message.success(data.message);
          resetForm();
        } else {
          message.error(data.message);
        }
      })
      .catch((err) => message.error(err));
  };

  // Delete
  const deleteData = (id) => {
    fetch(`${newsURL}/${id}`, {
      method: "DELETE",
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
      .catch((err) => message.error(err));
  };

  const resetForm = () => {
    setPostImage(null);
    setPostTitle("");
    setPostText("");
    setPostTitleUz("");
    setPostTextUz("");
    setPostAuthor("");
    form.resetFields();
  };

  // Tahrirlashni boshlash
  const handleEdit = (news) => {
    setIsEditMode(true);
    setCurrentNews(news);
    setPostTitle(news.title_en);
    setPostText(news.text_en);
    setPostTitleUz(news.title_uz);
    setPostTextUz(news.text_uz);
    setPostAuthor(news.author);
    setIsModalOpen(true);
    form.setFieldsValue({
      title: news.title_en,
      text: news.text_en,
      title_uz: news.title_uz,
      text_uz: news.text_uz,
      author: news.author,
    });
  };

  // Qo'shish
  const handleAdd = () => {
    setIsEditMode(false);
    setCurrentNews(null);
    resetForm();
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Title (EN)",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Title (UZ)",
      dataIndex: "title_uz",
      key: "title_uz",
    },
    {
      title: "Images",
      dataIndex: "image",
      key: "image",
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: (
        <Button type="primary" onClick={handleAdd}>
          Add News
        </Button>
      ),
      dataIndex: "add-news",
      key: "add-news",
    },
  ];

  const dataSource =
    data &&
    data.map((newsItem, index) => ({
      index: index + 1,
      key: newsItem.id,
      title: newsItem.title_en,
      title_uz: newsItem.title_uz,
      author: newsItem.author,
      image: (
        <Image
          width={120}
          height={100}
          src={`${imageURL}${newsItem?.news_images[0]?.["image.src"]}`}
          alt={newsItem.title_en}
        />
      ),
      action: (
        <Flex gap="small">
          <Button type="primary" onClick={() => handleEdit(newsItem)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete the news item"
            description="Are you sure to delete this news item?"
            onConfirm={() => deleteData(newsItem.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Flex>
      ),
    }));

  return (
    <section id="news">
      <h1>News</h1>
      <Table
        loading={loader}
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />

      {/* Modal for Add and Edit */}
      <Modal
        title={isEditMode ? "Edit News" : "Add News"}
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        okText="Submit"
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          autoComplete="off"
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <Form.Item
            label="Title (EN)"
            name="title"
            rules={[
              {
                required: true,
                message: "Please input the news title in English!",
              },
            ]}
          >
            <Input onChange={(e) => setPostTitle(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Text (EN)"
            name="text"
            rules={[
              {
                required: true,
                message: "Please input the news text in English!",
              },
            ]}
          >
            <Input.TextArea onChange={(e) => setPostText(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Title (UZ)"
            name="title_uz"
            rules={[
              {
                required: true,
                message: "Please input the news title in Uzbek!",
              },
            ]}
          >
            <Input onChange={(e) => setPostTitleUz(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Text (UZ)"
            name="text_uz"
            rules={[
              {
                required: true,
                message: "Please input the news text in Uzbek!",
              },
            ]}
          >
            <Input.TextArea onChange={(e) => setPostTextUz(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Author"
            name="author"
            rules={[
              {
                required: true,
                message: "Please input the author's name!",
              },
            ]}
          >
            <Input onChange={(e) => setPostAuthor(e.target.value)} />
          </Form.Item>

          <Form.Item label="Images" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload
              name="logo"
              accept="image/*"
              maxCount={1}
              beforeUpload={(file) => {
                setPostImage(file);
                return false; // Prevent automatic upload
              }}
              onRemove={() => {
                setPostImage(null);
              }}
            >
              <Button>Upload (Image)</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}

export default News;

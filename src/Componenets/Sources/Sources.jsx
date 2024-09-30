import React, { useEffect, useState } from 'react';
import { Button, Flex, Image, message, Table, Modal, Form, Input, Upload, Popconfirm } from "antd";

const Sources = () => {
  const [form] = Form.useForm();
  const sourcesUrl = 'https://api.dezinfeksiyatashkent.uz/api/sources'; // API URL
  const imageURL = "https://api.dezinfeksiyatashkent.uz/api/uploads/images/";
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSource, setCurrentSource] = useState(null);
  const token = localStorage.getItem("access_token");

  const [postName, setPostName] = useState("");
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState(null);

  const getData = () => {
    setLoader(true);
    fetch(sourcesUrl)
      .then((res) => res.json())
      .then((data) => setData(data.data)||
    console.log(data.data)
    )
      .catch((err) => message.error(err))
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    getData();
  }, []);

  const handleFormSubmit = () => {
    const formData = new FormData();
    formData.append('title', postName);
    formData.append('category', postText);
    if (postImage) {
      formData.append('images', postImage);
    }

    const url = isEditMode ? `${sourcesUrl}/${currentSource.id}` : sourcesUrl;
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
        resetForm();
      })
      .catch((err) => console.log(err));
  };

  const deleteData = (id) => {
    fetch(`${sourcesUrl}/${id}`, {
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
      .catch((err) => message.error(err));
  };

  const handleAdd = () => {
    setIsEditMode(false);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (source) => {
    setIsEditMode(true);
    setCurrentSource(source);
    setPostName(source.title);
    setPostText(source.category);
    setIsModalOpen(true);
    form.setFieldsValue({
      title: source.title,
      category: source.category,
    });
  };

  const resetForm = () => {
    setPostName("");
    setPostText("");
    setPostImage(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Text",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Images",
      dataIndex: "src",
      key: "src",
      render: (src) => (
        <Image width={110} height={100} src={`${imageURL}${src}`} alt={src} />
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Flex gap="small">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this source?"
            onConfirm={() => deleteData(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  const dataSource = data.map((source, index) => ({
    index: index + 1,
    key: source.id,
    title: source.title,
    category: source.category,
    src: source.src,
  }));

  return (
    <div>
      <section id="sources">
        <h1>Sources</h1>
        <Table
          loading={loader}
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />

        <Modal
          title={isEditMode ? "Edit Source" : "Add Source"}
          open={isModalOpen}
          footer={null}
          onCancel={() => setIsModalOpen(false)}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
          >
            <Form.Item
              label="Name"
              name="title"
              rules={[{ required: true, message: "Please input the source name!" }]}
            >
              <Input onChange={(e) => setPostName(e.target.value)} value={postName} />
            </Form.Item>
            <Form.Item
              label="Text"
              name="category"
              rules={[{ required: true, message: "Please input the source text!" }]}
            >
              <Input onChange={(e) => setPostText(e.target.value)} value={postText} />
            </Form.Item>
            <Form.Item
              label="Image"
              valuePropName="fileList"
            >
              <Upload
                accept="image/*"
                listType="picture-card"
                onChange={({ file }) => setPostImage(file.originFileObj)}
                customRequest={({ onSuccess }) => onSuccess("ok")}
              >
                <Button>Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Flex justify="flex-end" gap="small">
                <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit">Submit</Button>
              </Flex>
            </Form.Item>
          </Form>
        </Modal>
      </section>
    </div>
  );
};

export default Sources;

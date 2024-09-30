import React, { useEffect, useState } from 'react';
import { Button, message, Table, Modal, Form, Input, Popconfirm } from 'antd';
import Flex from 'antd/es/flex'; // Flex Ant Design dan bo'lishi uchun to'g'ri import qiling
const Category = () => {
  const [form] = Form.useForm();
  const categoryUrl = 'https://api.dezinfeksiyatashkent.uz/api/categories';
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [postName, setPostName] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const token = localStorage.getItem('access_token');

  // GET - Ma'lumotlarni olish
  const getData = () => {
    setLoader(true);
    fetch(categoryUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
        console.log(data.data);
      })
      .catch((err) => message.error(err))
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    getData();
  }, []);

  // POST yoki PUT - Yangi ma'lumot qo'shish yoki mavjudini yangilash
  const handleFormSubmit = () => {
    const formData = new FormData();
    formData.append('name', postName);
    formData.append('description', postDescription);

    const url = isEditMode ? `${categoryUrl}/${currentCategory.id}` : categoryUrl;
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
        setPostName('');
        setPostDescription('');
        form.resetFields();
      })
      .catch((err) => console.log(err));
  };

  // DELETE - Ma'lumotni o'chirish
  const deleteData = (id) => {
    fetch(`${categoryUrl}/${id}`, {
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

  // Yangi kategoriya qo'shish uchun modalni ochish
  const handleAdd = () => {
    setIsEditMode(false);
    setCurrentCategory(null);
    setPostName('');
    setPostDescription('');
    setIsModalOpen(true);
    form.resetFields();
  };

  // Tahrirlash uchun modalni ochish
  const handleEdit = (category) => {
    setIsEditMode(true);
    setCurrentCategory(category);
    setPostName(category.name);
    setPostDescription(category.description);
    setIsModalOpen(true);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
    });
  };

  // Jadval ustunlari
  const columns = [
    {
      title: 'Id',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: (
        <Button type='primary' onClick={handleAdd}>
          Add Category
        </Button>
      ),
      dataIndex: 'add-category',
      key: 'add-category',
    },
  ];

  // Jadval uchun ma'lumotlar manbai
  const dataSource =
    data &&
    data.map((category, index) => ({
      index: index + 1,
      key: category.id,
      name: category.name,
      description: category.description,
      action: (
        <Flex gap='small'>
          <Button type='primary' onClick={() => handleEdit(category)}>
            Edit
          </Button>
          <Popconfirm
            title='Delete the category'
            description='Are you sure to delete this category?'
            onConfirm={() => deleteData(category.id)}
            okText='Yes'
            cancelText='No'
          >
            <Button type='primary' danger>
              Delete
            </Button>
          </Popconfirm>
        </Flex>
      ),
    }));

  return (
    <div>
      <section id='category'>
        <h1>Category</h1>
        <Table
          loading={loader}
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />

        {/* Modal for Add and Edit */}
        <Modal
          title={isEditMode ? 'Edit Category' : 'Add Category'}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form
            form={form}
            name='basic'
            layout='vertical'
            onFinish={handleFormSubmit}
          >
            <Form.Item
              label='Name'
              name='name'
              rules={[
                {
                  required: true,
                  message: 'Please input the category name!',
                },
              ]}
            >
              <Input onChange={(e) => setPostName(e.target.value)} />
            </Form.Item>
            <Form.Item
              label='Description'
              name='description'
              rules={[
                {
                  required: true,
                  message: 'Please input the category description!',
                },
              ]}
            >
              <Input onChange={(e) => setPostDescription(e.target.value)} />
            </Form.Item>

            <Form.Item>
              <Flex justify='flex-end' gap='small'>
                <Button htmlType='button' onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type='primary' htmlType='submit'>
                  Submit
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        </Modal>
      </section>
    </div>
  );
};

export default Category;

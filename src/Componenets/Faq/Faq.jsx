import { Button, Table, Modal, Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';

function Faq() {
  const [faqs, setFaqs] = useState([]); // FAQ ma'lumotlarini saqlash
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal holatini boshqarish
  const [selectedFaq, setSelectedFaq] = useState(null); // Tanlangan FAQ ni saqlash

  const Url = 'https://api.dezinfeksiyatashkent.uz/api/faqs'; // FAQ API manzili
  const access_token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTczNzkzNTUtZDNjYi00NzY1LTgwMGEtNDZhOTU1NWJiOWQyIiwidG9rZW5fdHlwZSI6ImFjY2VzcyIsImlhdCI6MTcyMDA5NDM4MywiZXhwIjoxNzUxNjMwMzgzfQ.TCJEizDzsDtjme-0kbVRRGn_mrSa2aFLIpaCeTX1h00';

  // Faqlarni olish
  const getFaqs = () => {
    fetch(Url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        const transformedData = res.data.map((entry, index) => ({
          ...entry,
          index: index + 1,
        }));
        setFaqs(transformedData);
      })
      .catch((error) => console.error('Error fetching FAQs:', error));
  };

  useEffect(() => {
    getFaqs();
  }, []);

  const columns = [
    { title: 'Index', dataIndex: 'index', key: 'index' },
    { title: 'Title (UZ)', dataIndex: 'title_uz', key: 'title_uz' },
    { title: 'Title (RU)', dataIndex: 'title_ru', key: 'title_ru' },
    { title: 'Title (EN)', dataIndex: 'title_en', key: 'title_en' },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <div>
          <Button type="primary" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="primary" danger onClick={() => handleDelete(record.id)} style={{ marginLeft: '20px' }}>Delete</Button>
        </div>
      ),
    },
  ];

  // Modalni ko'rsatish
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedFaq(null);
  };

  // Form submit qilinganda
  const onFinish = (values) => {
    if (selectedFaq) {
      // Mavjud FAQni yangilash
      updateFaq(values);
    } else {
      // Yangi FAQ qo'shish
      addFaq(values);
    }
  };

  const addFaq = (values) => {
    fetch(Url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        title_uz: values.title_uz,
        title_ru: values.title_ru,
        title_en: values.title_en,
        text_uz: values.text_uz,
        text_ru: values.text_ru,
        text_en: values.text_en,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          message.success('FAQ added successfully');
          setIsModalOpen(false);
          getFaqs(); // Ma'lumotni yangilash
        } else {
          message.error('Failed to add FAQ');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        message.error('Failed to add FAQ');
      });
  };

  const updateFaq = (values) => {
    fetch(`${Url}/${selectedFaq}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        title_uz: values.title_uz,
        title_ru: values.title_ru,
        title_en: values.title_en,
        text_uz: values.text_uz,
        text_ru: values.text_ru,
        text_en: values.text_en,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          message.success('FAQ updated successfully');
          setIsModalOpen(false);
          getFaqs(); // Ma'lumotni yangilash
        } else {
          message.error('Failed to update FAQ');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        message.error('Failed to update FAQ');
      });
  };

  // Edit action
  const handleEdit = (record) => {
    setSelectedFaq(record.id);
    setIsModalOpen(true);
  };

  // Delete action
  const handleDelete = (id) => {
    fetch(`${Url}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          message.success('FAQ deleted successfully');
          getFaqs(); // Ma'lumotni yangilash
        } else {
          message.error('Failed to delete FAQ');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        message.error('Failed to delete FAQ');
      });
  };

  return (
    <div className="container">
      <Button style={{ marginLeft: '35px' }} type="primary" onClick={showModal}>Add FAQ</Button>
      <Table
        bordered
        caption={'FAQ'}
        dataSource={faqs}
        columns={columns}
        rowKey="id"
        style={{ width: "1200px", margin: '5px auto' }}
      />
      <Modal title={selectedFaq ? 'Edit FAQ' : 'Add FAQ'} visible={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Title (UZ)"
            name="title_uz"
            rules={[{ required: true, message: 'Please input the title in Uzbek!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Title (RU)"
            name="title_ru"
            rules={[{ required: true, message: 'Please input the title in Russian!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Title (EN)"
            name="title_en"
            rules={[{ required: true, message: 'Please input the title in English!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Text (UZ)"
            name="text_uz"
            rules={[{ required: true, message: 'Please input the text in Uzbek!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Text (RU)"
            name="text_ru"
            rules={[{ required: true, message: 'Please input the text in Russian!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Text (EN)"
            name="text_en"
            rules={[{ required: true, message: 'Please input the text in English!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Faq;
  
import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, Upload, message, Popconfirm, Image } from "antd";
import { v4 as uuidv4 } from 'uuid';

const Services = () => {
  const [form] = Form.useForm();
  const servicesUrl = 'https://api.dezinfeksiyatashkent.uz/api/services';
  const imageURL = "https://api.dezinfeksiyatashkent.uz/api/uploads/images/";
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const token = localStorage.getItem("access_token");

  const [formData, setFormData] = useState({
    title_en: '',
    title_ru: '',
    title_uz: '',
    text_en: '',
    text_ru: '',
    text_uz: '',
    title_tr: '',
    title_zh: '',
    text_zh: '',
    text_tr: '',
    images: null,
  });

  const fetchData = async () => {
    try {
      setLoader(true);
      const response = await fetch(servicesUrl);
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      message.error('Failed to fetch services');
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormSubmit = async () => {
    const url = isEditMode ? `${servicesUrl}/${currentService.id}` : servicesUrl;
    const requestMethod = isEditMode ? 'PUT' : 'POST';

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    if (!isEditMode) {
      formDataToSend.append('id', uuidv4());
    }

    try {
      const response = await fetch(url, {
        method: requestMethod,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      const result = await response.json();
      message.success(result.message);
      fetchData();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      message.error('Failed to submit form');
    }
  };

  const deleteService = async (id) => {
    try {
      const response = await fetch(`${servicesUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      message.success(result.message);
      fetchData();
    } catch (error) {
      message.error('Failed to delete service');
    }
  };

  const handleEdit = (service) => {
    setIsEditMode(true);
    setCurrentService(service);
    setFormData({
      title_en: service.title_en,
      title_ru: service.title_ru,
      title_uz: service.title_uz,
      text_en: service.text_en,
      text_ru: service.text_ru,
      text_uz: service.text_uz,
      title_tr: service.title_tr,
      title_zh: service.title_zh,
      text_zh: service.text_zh,
      text_tr: service.text_tr,
      images: null,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title_en: '',
      title_ru: '',
      title_uz: '',
      text_en: '',
      text_ru: '',
      text_uz: '',
      title_tr: '',
      title_zh: '',
      text_zh: '',
      text_tr: '',
      images: null,
    });
    form.resetFields();
    setIsEditMode(false);
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Title (EN)',
      dataIndex: 'title_en',
      key: 'title_en',
    },
    {
      title: 'Title (RU)',
      dataIndex: 'title_ru',
      key: 'title_ru',
    },
    {
      title: 'Title (UZ)',
      dataIndex: 'title_uz',
      key: 'title_uz',
    },
    {
      title: 'Image',
      dataIndex: 'image_src',
      key: 'image_src',
      render: (text, record) => (
        <Image
          width={120}
          height={100}
          src={record.imageURL} // Use the imageURL created in dataSource
          alt={record.title_en}
        />
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Delete this service?"
            onConfirm={() => deleteService(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="primary">Delete</Button>
          </Popconfirm>
        </>
      ),
    },
    {
      title:    <Button type="primary" onClick={() => { resetForm(); setIsModalOpen(true); }} style={{ marginBottom: 16 }}>
      Add Service
    </Button>,
      dataIndex: '',
      key: '',
    },
  ];

  // Data source yangilanmoqda
  const dataSource = data.map((service) => ({
    id: service.id,
    title_en: service.title_en,
    title_ru: service.title_ru,
    title_uz: service.title_uz,
    image_src: service.image_src ? service.image_src[0] : '', // Rasmni olish
    imageURL: service.image_src ? `${imageURL}${service.image_src}` : '', // Rasm URL
  }));

  return (
    <div>
      <h1>Services</h1>
   
    
      <Table
        loading={loader}
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey="id"
      />
      <Modal
        title={isEditMode ? "Edit Service" : "Add Service"}
        visible={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          {Object.keys(formData).map((key) => (
            <Form.Item key={key} label={key.replace(/_/g, ' ').toUpperCase()}>
              {key === 'images' ? (
                <Upload
                  beforeUpload={(file) => {
                    setFormData((prev) => ({ ...prev, images: file }));
                    return false;
                  }}
                  showUploadList={false}
                >
                  <Button>Upload Image</Button>
                </Upload>
              ) : (
                <Input
                  onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))}
                  value={formData[key]}
                />
              )}
              {key === 'images' && formData.images && (
                <Image
                  width={120}
                  height={100}
                  src={URL.createObjectURL(formData.images)} // Preview uploaded image
                  alt="Preview"
                  style={{ marginTop: 10 }}
                />
              )}
            </Form.Item>
          ))}
          <Form.Item>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Services;

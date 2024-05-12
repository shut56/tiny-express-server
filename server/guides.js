const guides = () => {
  return [
    {
      label: 'How to remove user',
      method: 'DELETE',
      url: '/api/v1/learn/api/user/<your-id>',
      headers: {
        Authorization: 'Bearer <your-hash>',
      },
    },
    {
      label: 'How to get hash',
      method: 'GET',
      url: '/api/v1/learn/api/user/<your-id>/hash',
    },
    {
      label: 'How to get your id',
      method: 'POST',
      url: '/api/v1/learn/api/auth',
      body: {
        login: '<your-login>',
        password: '<your-password>',
      },
    },
  ];
};

module.exports = {
  guides,
};

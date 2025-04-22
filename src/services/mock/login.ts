// 模拟登录接口响应
export const mockLoginResponse = (email: string, _password: string) => {
  // 模拟登录成功的响应
  return {
    code: 200,
    message: '登录成功',
    data: {
      user_type: 'normal',
      name: 'test name',
      level_of_study: 'postgraduate',
      created_at: '2025-03-29T22:16:44.000+00:00',
      id: 5529174,
      email: email, // 使用传入的邮箱
      token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NTI5MTc0IiwiZW1haWwiOiIxMjNAZ21haWwuY29tIiwicm9sZSI6Im5vcm1hbCIsImlhdCI6MTc0MzQwMjk0MSwiZXhwIjoxNzQzNDg5MzQxfQ.o1JfQZrkra5xOiNVQCaubYBYBYT_UU3agvduDf8Gmy4',
    },
  };
};

// 模拟登录失败的响应 - 密码错误
export const mockLoginFailedResponse = () => {
  return {
    code: 500,
    message: '密码错误',
    data: null,
  };
};

// 模拟登录失败的响应 - 用户不存在
export const mockUserNotExistResponse = () => {
  return {
    code: 500,
    message: '用户不存在',
    data: null,
  };
};

// 模拟注册成功的响应
export const mockRegisterResponse = (userData: any) => {
  return {
    code: 200,
    message: '注册成功',
    data: {
      user_field: userData.userField || 'Engineering',
      user_type: 'normal',
      user_country: userData.userCountry || 'China',
      user_regions: userData.userRegions || 'Beijing',
      name: userData.name,
      level_of_study: 'postgraduate',
      created_at: new Date().toISOString(),
      user_language: userData.userLanguage || 'Chinese',
      user_city: userData.userCity || 'Sydney',
      id: 5529176,
      email: userData.email,
      user_uni: userData.userUni || 'University of New South Wales',
    },
  };
};

// 模拟注册失败的响应 - 邮箱已被注册
export const mockRegisterFailedResponse = () => {
  return {
    code: 500,
    message: 'the email has been registered',
    data: null,
  };
};

// 模拟的用户数据
export const mockUsers = [
  {
    email: '123@gmail.com',
    password: '12345',
    id: 5529174,
    name: 'test name',
    user_type: 'normal',
    level_of_study: 'postgraduate',
    created_at: '2025-03-29T22:16:44.000+00:00',
  },
];

// 简单的登录验证函数
export const validateLogin = (email: string, password: string) => {
  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    return mockUserNotExistResponse();
  }
  if (user.password !== password) {
    return mockLoginFailedResponse();
  }
  return mockLoginResponse(email, password);
};

// 简单的注册验证函数
export const validateRegister = (userData: any) => {
  const existingUser = mockUsers.find(u => u.email === userData.email);
  if (existingUser) {
    return mockRegisterFailedResponse();
  }
  // 模拟添加新用户
  const newUser = {
    email: userData.email,
    password: userData.password,
    id: 5529176,
    name: userData.name,
    user_type: 'normal',
    level_of_study: 'postgraduate',
    created_at: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  return mockRegisterResponse(userData);
};

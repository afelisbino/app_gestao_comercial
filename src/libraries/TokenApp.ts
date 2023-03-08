const token: string | null = localStorage.getItem('token');
const authorization: string =  `Bearer ${token}`

export default authorization;
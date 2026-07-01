import React, { useState } from 'react';

const mockUser = {
  name: 'Nguyễn Văn An',
  email: 'nguyenvanan@example.com',
  phone: '0901234567',
  address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
  password: '',
  confirmPassword: '',
};

interface UpdateProfileProps {
  onBack: () => void;
}

const UpdateProfile: React.FC<UpdateProfileProps> = ({ onBack }) => {
  const [form, setForm] = useState(mockUser);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Tên không được để trống';
    if (!form.email.includes('@')) newErrors.email = 'Email không hợp lệ';
    if (form.phone && !/^[0-9]{10,11}$/.test(form.phone))
      newErrors.phone = 'Số điện thoại phải có 10-11 chữ số';
    if (form.password && form.password.length < 6)
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    if (form.password && form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSuccess(true);
    window.dispatchEvent(new CustomEvent('mfe:profile-updated', { detail: form }));
    setTimeout(() => {
      setSuccess(false);
      onBack();
    }, 1500);
  };

  const Field: React.FC<{
    label: string;
    name: keyof typeof mockUser;
    type?: string;
    placeholder?: string;
  }> = ({ label, name, type = 'text', placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[name]}
        onChange={e => setForm(prev => ({ ...prev, [name]: e.target.value }))}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-300'
        }`}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-5 text-sm flex items-center gap-2">
          ✓ Cập nhật thông tin thành công!
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors">
          ←
        </button>
        <h2 className="text-lg font-bold text-gray-800">Chỉnh sửa thông tin</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Họ và tên *" name="name" placeholder="Nguyễn Văn A" />
          <Field label="Email *" name="email" type="email" placeholder="email@example.com" />
          <Field label="Số điện thoại" name="phone" placeholder="0901234567" />
          <Field label="Địa chỉ" name="address" placeholder="Số nhà, đường, quận, thành phố" />
        </div>

        <hr className="border-gray-100" />
        <p className="text-sm text-gray-500">Đổi mật khẩu (để trống nếu không thay đổi)</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Mật khẩu mới" name="password" type="password" placeholder="Tối thiểu 6 ký tự" />
          <Field label="Xác nhận mật khẩu" name="confirmPassword" type="password" placeholder="Nhập lại mật khẩu" />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
          >
            Lưu thay đổi
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-sm"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;

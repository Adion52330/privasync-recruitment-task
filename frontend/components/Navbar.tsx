type NavbarProps = {
  username: string;
  onLogout: () => void;
};

export default function Navbar({ username, onLogout }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center mt-4 max-w-4xl mx-auto rounded-lg absolute left-1/2 transform -translate-x-1/2 w-full">
      <div className="text-lg font-semibold text-gray-800">
        {username}
      </div>

      <button
        onClick={onLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </nav>
  );
}
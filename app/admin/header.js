export default function HeaderPage() {
  return (
    <header
      as="nav"
      className="bg-white shadow"
    >
      <div className="mx-auto px-2 px-8">
        <div className="relative flex h-16 justify-between">
          <div className="flex flex-1 items-stretch justify-start">
            <div className="ml-6 flex space-x-8">
              <a
                href="/admin/list"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                表單列表
              </a>
              <a
                href="/admin/create"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                建立表單
              </a>
            </div>
          </div>
          <div className="ml-6 flex space-x-8">
            <a
              href="#"
              className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              登出
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

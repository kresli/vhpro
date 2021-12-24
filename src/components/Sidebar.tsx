export const SideBar = () => {
  return (
    <div className="bg-green-300 w-[320px] flex flex-col overflow-hidden">
      <input />
      <div className="border border-b" />
      <div className="flex flex-1 overflow-y-scroll">
        <ul>
          {Array.from({ length: 100 }).map(() => (
            <li>list</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

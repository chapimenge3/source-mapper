export function TextArea({
    value,
    setValue
  }) {
    const handleChange = (e) => {
      setValue(e.target.value);
    }
    return (
      (<div
        className="my-10 mx-auto max-w-[800px] bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
        <textarea
          className="w-full h-full p-4 text-gray-600 dark:text-gray-200 text-sm"
          rows='15'
          value={value}
          onChange={handleChange}
          placeholder="Type weburl or your .map file here..." />
      </div>)
    );
  }
  
  
  export default TextArea
  
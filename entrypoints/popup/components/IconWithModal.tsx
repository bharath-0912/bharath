import React, { useState, useRef, useEffect } from "react";
import InsertButton from "./InsertButton";
import RegenerateButton from "./RegenerateButton";
import GenerateButton from "./GenerateButton";

const IconWithModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [showInputValue, setShowInputValue] = useState("");
  const insertedTextElementRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLImageElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Handling the focus of the input field and showing the icon
  useEffect(() => {
    const chatInput = document.querySelector<HTMLElement>(
      ".msg-form__contenteditable"
    );

    if (!chatInput) {
      console.error("Chat input element not found");
      return;
    }
    const handleFocus = () => setIsFocused(true);
    chatInput.addEventListener("focus", handleFocus);
    return () => {
      chatInput.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Hide icon when clicking anywhere outside the icon or the input field
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const iconElement = iconRef.current;
      const chatInput = document.querySelector<HTMLElement>(
        ".msg-form__contenteditable"
      );

      if (
        iconElement &&
        !iconElement.contains(e.target as Node) &&
        chatInput &&
        !chatInput.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Function to open the modal
  const openModal = () => {
    setShowModal(true);
    setIsClicked(false);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Function to insert the text to the input box
  const insertTextToInputBoxFn = () => {
    const chatInput = document.querySelector<HTMLElement>(
      ".msg-form__contenteditable"
    );

    if (!chatInput) {
      console.error("Chat input not found");
      return;
    }

    const text = insertedTextElementRef?.current?.textContent || "";

    chatInput.innerHTML = `<p>${text}</p>`;

    const inputEvent = new Event("input", {
      bubbles: true,
      cancelable: true,
    });
    chatInput.dispatchEvent(inputEvent);

    closeModal();
  };

  return (
    <div className="">
      {/* Icon */}
      {isFocused && (
        <img
          id="icon"
          ref={iconRef}
          src={chrome.runtime.getURL("assets/frame.svg")}
          alt="My Extension Icon"
          className="w-16 h-16 cursor-pointer"
          onClick={(e: React.MouseEvent<HTMLImageElement>) => {
            e.stopPropagation();
            setIsFocused(true);
            openModal();
          }}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            const target = e.target as HTMLElement;
            if (target.id === "overlay") closeModal();
          }}
          id="overlay"
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
        >
          <div className="bg-white w-1/3 p-4 rounded-lg shadow-md">
            {isClicked && showInputValue && (
              <div className="flex flex-col gap-4 my-3">
                <p className="bg-gray-300 text-2xl self-end text-gray-500 px-4 py-1 rounded-lg">
                  {showInputValue}
                </p>
                <p
                  id="inserted-text"
                  className="text-2xl bg-blue-200 self-start w-2/3 text-gray-500 px-4 py-1 rounded-lg"
                  ref={insertedTextElementRef}
                >
                  Thank you for the opportunity! If you have any more questions
                  or if there's anything else I can help you with, feel free to
                  ask
                </p>
              </div>
            )}
            <input
              type="text"
              value={inputValue}
              placeholder="Your Prompt..."
              className="w-full py-3 px-6 border rounded"
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowInputValue(e.target.value);
              }}
            />
            <div className="flex gap-3 justify-end">
              {isClicked && showInputValue && (
                <InsertButton insertActionHandler={insertTextToInputBoxFn} />
              )}

              {isClicked && showInputValue ? (
                <RegenerateButton />
              ) : (
                <GenerateButton
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  setIsClicked={setIsClicked}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IconWithModal;

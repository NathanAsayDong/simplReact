import { faPaperPlane, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEvent, FC, useState } from 'react';
import './Assistant.component.scss';
import { Modal } from '@mui/material';


interface AssistantProps {}

const Assistant: FC<AssistantProps> = () => {
    const [showAssistantModal, setShowAssistantModal] = useState(false);
    const [messages, setMessages] = useState<AssistantMessage[]>([]);
    const [inputValue, setInputValue] = useState('');

    const insertDummyMessagesForTesting = () => {
        const dummyMessages: AssistantMessage[] = [
            { role: 'assistant', content: 'Hello! How can I help you?' },
            { role: 'user', content: 'What is the weather like today?' },
            { role: 'assistant', content: 'The weather is sunny with a high of 75°F.' },
        ];
        setMessages(dummyMessages);
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (inputValue.trim()) {
                setMessages([...messages, { role: 'user', content: inputValue }]);
                setInputValue('');
            }
        }
    };

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            setMessages([...messages, { role: 'user', content: inputValue }]);
            setInputValue('');
        }
    }

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        // Auto-resize
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return (
        <>
        
        <div className='assistant-button special-background-animated' onClick={() => setShowAssistantModal(true)}>
            <FontAwesomeIcon icon={faStar} className='assistant-icon' />
        </div>

        <Modal open={showAssistantModal} onClose={() => setShowAssistantModal(false)}>
            <div className='assistant-modal'>
                <div className='assistant-modal-header'>
                    <h2 onClick={insertDummyMessagesForTesting}>Simpl Assistant</h2>
                    
                </div>
                <div className='scroll-container'>
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.role}`}>
                            {message.content}
                        </div>
                    ))}
                </div>
                <div className='input-text'>
                    <textarea
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder='How can I help you?'
                        rows={1}
                    />
                    <FontAwesomeIcon icon={faPaperPlane} className='send-message-icon' onClick={handleSendMessage} />
                </div>
            </div>
        </Modal>

        </>
    );
};

export default Assistant;

interface AssistantMessage {
    role: 'user' | 'assistant';
    content: string;
}
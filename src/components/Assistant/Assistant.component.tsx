import { faPaperPlane, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEvent, FC, useState } from 'react';
import './Assistant.component.scss';
import { Modal } from '@mui/material';
import LoadingDots from '../SharedComponents/LoadingDots/LoadingDots.component';
import { DataApiService } from '../../services/Classes/dataApiService';


interface AssistantProps {}

const Assistant: FC<AssistantProps> = () => {
    const [showAssistantModal, setShowAssistantModal] = useState(false);
    const [messages, setMessages] = useState<AssistantMessage[]>(defaultStarterMessages);
    const [inputValue, setInputValue] = useState('');
    const [awaitingResponse, setAwaitingResponse] = useState(false);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (inputValue.trim()) {
                setMessages([...messages, { role: 'user', content: inputValue }]);
                setInputValue('');
                requestAiResponse(inputValue);
            }
        }
    };

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            setMessages([...messages, { role: 'user', content: inputValue }]);
            setInputValue('');
            requestAiResponse(inputValue);
        }
    }

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const requestAiResponse = async (question : string) => {
        setAwaitingResponse(true);
        const conversationContext = messages.map((message) => message.content).join(' ');
        const response = await DataApiService.getAiQuestionResponse(question, conversationContext);
        setAwaitingResponse(false);
        setMessages((prevMessages) => [
            ...prevMessages,
            { role: 'assistant', content: response},
        ]);
    }

    return (
        <>
        
        <div className='assistant-button special-background-animated' onClick={() => setShowAssistantModal(true)}>
            <FontAwesomeIcon icon={faStar} className='assistant-icon' />
        </div>

        <Modal open={showAssistantModal} onClose={() => setShowAssistantModal(false)}>
            <div className='assistant-modal'>
                <div className='assistant-modal-header'>
                    <h2>Simpl Assistant</h2>
                    
                </div>
                <div className='scroll-container'>
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.role}`}>
                            {message.content}
                        </div>
                    ))}
                    {awaitingResponse && ( <div className='message assistant'>
                        <LoadingDots />
                    </div> )}
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

const defaultStarterMessages: AssistantMessage[] = [
    { role: 'assistant', content: 'Hello! I am the Simpl Assistant. How can I help you today?' },
];
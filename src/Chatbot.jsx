import React, {useEffect, useRef, useState} from 'react';
import {X, ArrowRight, ArrowCounterClockwise} from '@phosphor-icons/react';
import pages from '../data/catalog.json';
import './chatbot.css';

const greeting = 'Namaste! Main ASCA ka AI course guide hoon. Courses, syllabus, study options ya career goals ke baare mein poochhiye. Hinglish mein shuru karte hain — aap apni pasand ki language mein bhi baat kar sakte hain.';
const suggestions = ['CA Foundation mein kya padhaya jaata hai?', 'Mere liye kaunsa course sahi rahega?', 'Online classes aur fees ke baare mein batao'];
const allowedPaths = new Set([...pages.map(page => page.path), '/search/']);

function Answer({text}) {
  // Render model text without HTML. Only real website routes become links.
  return text.split('\n').map((line, row) => <p key={row}>{line.split(/(\[[^\]]+\]\(\/[^\s)]*\))/g).map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\((\/[^\s)]*)\)$/);
    return match && allowedPaths.has(match[2]) ? <a key={i} href={match[2]}>{match[1]}</a> : <React.Fragment key={i}>{part.replace(/\*\*/g, '')}</React.Fragment>;
  })}</p>);
}

function ChatPanel({onClose}) {
  const dialog = useRef(null), input = useRef(null), scroll = useRef(null), pending = useRef(null), generation = useRef(0);
  const [messages, setMessages] = useState([]), [draft, setDraft] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState('');
  useEffect(() => {
    dialog.current.showModal();
    input.current.focus();
    return () => {generation.current++; pending.current?.abort();};
  }, []);
  useEffect(() => {if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;}, [messages, busy, error]);
  function reset() {
    generation.current++;
    pending.current?.abort(); pending.current = null;
    setMessages([]); setDraft(''); setBusy(false); setError(''); input.current?.focus();
  }
  async function send(value = draft) {
    const content = value.trim();
    if (!content || content.length > 1200 || pending.current) return;
    const previous = messages.slice(-10);
    while (previous.reduce((size, m) => size + m.content.length, content.length) > 12000) previous.splice(0, 2);
    const conversation = [...previous, {role:'user', content}];
    const controller = new AbortController(), current = generation.current;
    pending.current = controller;
    setDraft(''); setError(''); setBusy(true); setMessages(conversation);
    const timeout = setTimeout(() => controller.abort(), 60000);
    try {
      const response = await fetch('/api/chat', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({messages:conversation}), signal:controller.signal});
      const body = await response.json();
      if (!response.ok || typeof body.answer !== 'string' || !body.answer.trim()) throw new Error(body.error || 'Abhi jawab nahi mil paaya. Phir se try karein.');
      if (generation.current === current) setMessages([...conversation, {role:'assistant', content:body.answer}]);
    } catch (problem) {
      if (generation.current === current) {
        setMessages(previous); setDraft(content);
        setError(problem.name === 'AbortError' ? 'Jawab mein zyada samay lag raha hai. Dobara try karein, ya ASCA ko call karein.' : problem.message);
      }
    } finally {
      clearTimeout(timeout);
      if (generation.current === current) {pending.current = null; setBusy(false); input.current?.focus();}
    }
  }
  return <dialog ref={dialog} className="asca-chat" aria-labelledby="asca-chat-title" aria-describedby="asca-chat-note"
    onCancel={event => {event.preventDefault(); onClose();}}
    onClick={event => {if (event.target === dialog.current) {const rect = dialog.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();}}}>
    <div className="asca-chat-shell">
      <header className="asca-chat-header"><img src="/assets/chat-book.svg" alt=""/><div><h2 id="asca-chat-title">ASCA course guide</h2><span>Aapka learning companion</span></div><button type="button" onClick={reset} aria-label="Reset chat" title="Start a new chat"><ArrowCounterClockwise size={20}/></button><button type="button" onClick={onClose} aria-label="Close and reset chat"><X size={22}/></button></header>
      <div ref={scroll} className="asca-chat-messages" role="log" aria-label="Chat conversation" aria-live="polite" aria-relevant="additions text">
        <div className="asca-chat-message assistant"><span className="asca-chat-speaker">ASCA guide</span><Answer text={greeting}/></div>
        {!messages.length && <div className="asca-chat-suggestions">{suggestions.map(value => <button key={value} type="button" disabled={busy} onClick={() => send(value)}>{value}<ArrowRight size={16}/></button>)}</div>}
        {messages.map((message, index) => <div key={index} className={'asca-chat-message '+message.role}><span className="asca-chat-speaker">{message.role === 'user' ? 'You' : 'ASCA guide'}</span><Answer text={message.content}/></div>)}
        {busy && <div className="asca-chat-thinking" role="status">ASCA guide jawab taiyaar kar raha hai…</div>}
        {error && <p className="asca-chat-error" role="alert">{error}</p>}
      </div>
      <form className="asca-chat-form" onSubmit={event => {event.preventDefault(); send();}}><label className="sr-only" htmlFor="asca-chat-input">Ask about ASCA in your preferred language</label><textarea ref={input} id="asca-chat-input" value={draft} onChange={event => setDraft(event.target.value)} maxLength={1200} rows={2} placeholder="Apna sawaal likhiye…" onKeyDown={event => {if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {event.preventDefault(); send();}}}/><button type="submit" disabled={busy || !draft.trim()} aria-label="Send message"><ArrowRight size={22}/></button></form>
      <p id="asca-chat-note" className="asca-chat-note">AI guide · Fees aur batches team se confirm karein.<br/>Messages AI service ko bheje jaate hain. Chat close karte hi reset hoti hai. <a href="tel:+919837622221">Call ASCA</a></p>
    </div>
  </dialog>;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const launcher = useRef(null);
  function close() {setOpen(false); requestAnimationFrame(() => launcher.current?.focus());}
  return <><button ref={launcher} className="asca-chat-launcher" type="button" onClick={() => setOpen(true)} aria-label="Chat with ASCA course guide" aria-haspopup="dialog" aria-expanded={open}><img src="/assets/chat-book.svg" alt=""/><span>Ask ASCA</span></button>{open && <ChatPanel onClose={close}/>}</>;
}

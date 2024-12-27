import { useState } from 'react';
import { toast } from 'react-toastify';
import { REST_ENDPOINT } from '../constants';

export default function useGame(game, formRef) {
  const [current, setCurrent] = useState(game);
  const [isEditing, setIsEditing] = useState(false);

  async function saveGame(event) {
    console.log('save game');
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const priority = formData.get('priority');
    const platform = formData.get('platform');
    const status = formData.get('status');
    const graphicStyle = formData.get('graphicStyle');
    const tags = formData.get('tags');
    const thoughts = formData.get('thoughts');
    const playniteTitle = formData.get('playniteTitle');
    if (priority === '') {
      toast.error('Missing Priority value');
      return;
    }
    const endpoint = `${REST_ENDPOINT}/api/games/${game.id}`;
    const config = {
      method: 'POST',
      body: JSON.stringify({
        priority,
        platform,
        status,
        graphic_style: graphicStyle,
        tags,
        thoughts,
        playnite_title: playniteTitle,
      }),
    };
    try {
      const response = await fetch(endpoint, config);
      console.log('response :', response);
      if (!response.ok) {
        console.log('response.status :', response.status);
        throw new Error(response.status);
      } else {
        const data = await response.json();
        console.log('data :', data);
        setCurrent({
          ...current,
          priority,
          platform,
          status,
          graphic_style: graphicStyle,
          tags,
          thoughts,
          playnite_title: playniteTitle,
        });
        setIsEditing(false);
      }
    } catch (err) {
      console.log(`Error: ${err}`);
      toast.error(`loading error : ${err}`);
    }
  }

  function addRemoveTag(content) {
    console.log('addRemove', content);

    const tagsInput = formRef.current.querySelector('input[name="tags"]');
    if (!tagsInput.value.includes(content)) {
      tagsInput.value = `${tagsInput.value} ${content}`;
    } else {
      tagsInput.value = tagsInput.value.replace(content, '').trim();
    }
  }
  return {
    saveGame,
    addRemoveTag,
    current,
    isEditing,
    setIsEditing,
  };
}

import { GoogleGenerativeAI } from '@google/generative-ai';
import clipboardCopy from 'clipboard-copy';
import React, { useState } from 'react';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState('');  // APIキー
  const [inputText, setInputText] = useState('');  // 翻訳する文章
  const [targetLanguage, setTargetLanguage] = useState('日本語');  // 翻訳先言語
  const [geminiModel, setGeminiModel] = useState('gemini-2.0-flash-lite');  // 使用するモデル
  const [outputText, setOutputText] = useState('');  // 翻訳結果
  const [isLoading, setIsLoading] = useState(false);  // ローディング状態 (geminiのAPIを呼び出している間はtrue)
  const [error, setError] = useState(null);  // エラーメッセージ

  const handleTranslate = async () => {
    if (!apiKey) {
      setError('APIキーを入力してください');
      return;
    }

    if (!inputText) {
      setError('翻訳する文章を入力してください');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: geminiModel });

      const prompt = `Translate the following text to ${targetLanguage}. Return only the translated text:\n\n${inputText}`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      setOutputText(text);
    } catch (err) {
      console.error('翻訳エラー:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    clipboardCopy(outputText)
      .then(() => {
        alert('テキストをクリップボードにコピーしました！');
      })
      .catch((err) => {
        console.error('コピーエラー:', err);
        alert('コピーに失敗しました。');
      });
  };

  return (
    <div className="app-container">
      <h1>Gemini 翻訳ツール</h1>

      <div className="input-group">
        <label>
          Gemini API キー
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder=""
            className="api-key-input"
          />
        </label>
      </div>
      <button className="button" onClick={() => window.open('https://aistudio.google.com/apikey', '_blank', 'noopener,noreferrer')}>APIキーを取得</button>
      <p>入力したAPIキーは、外部のサーバーには送信されず、このサイト内でのみ利用されます。</p>

      <div className="input-group">
        <label>
          翻訳する文章
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="ここに翻訳したい文章を入力してください..."
            rows={5}
          />
        </label>
      </div>

      <div className="input-group">
        <label>
          翻訳先言語
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            <option value="Japanese">日本語</option>
            <option value="Korean">韓国語</option>
            <option value="English">英語</option>
            <option value="Chinese traditional">繁体字中国語</option>
            <option value="French">フランス語</option>
            <option value="Chinese simplified">簡体字中国語</option>
            <option value="Malay">マレー語</option>
            <option value="Tamil">タミル語</option>
            <option value="Hungarian">ハンガリー語</option>
            <option value="German">ドイツ語</option>
            <option value="Hindu">ヒンディー語</option>
            <option value="Italian">イタリア語</option>
          </select>
        </label>
      </div>

      <div className="input-group">
        <label>
          使用するモデル
          <select
            value={geminiModel}
            onChange={(e) => setGeminiModel(e.target.value)}
          >
            <option value="gemini-2.0-flash-lite">Gemini 2.0 Flash Lite</option>
            <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
            <option value="gemini-2.5-pro-exp-03-25">Gemini 2.5 Pro</option>
          </select>
        </label>
      </div>

      <button
        onClick={handleTranslate}
        disabled={isLoading}
        className="button"
      >
        {isLoading ? '翻訳中...' : '翻訳する'}
      </button>

      {error && <div className="error-message">{error}</div>}

      {outputText && (
        <div className="output-container">
          <h2>翻訳結果</h2>
          <div className="output-text-container">
            <div className="output-text">{outputText}</div>
            <button
              onClick={handleCopy}
              className="copy-button"
            >
              コピー
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

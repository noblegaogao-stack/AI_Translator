import React, { useState } from 'react'
import { Tabs, Input, Button, Upload, message, Select, Checkbox, Divider, Space } from 'antd'
import { UploadOutlined, FileTextOutlined, PictureOutlined, MailOutlined, GlobalOutlined } from '@ant-design/icons'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const { TextArea } = Input
const { Option } = Select
const { TabPane } = Tabs

function App() {
  // 国际化
  const { t, i18n } = useTranslation()
  
  // 状态管理
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('zh')
  const [translationStyle, setTranslationStyle] = useState('general')
  const [industry, setIndustry] = useState('general')
  const [translateTables, setTranslateTables] = useState(true)
  const [translateImages, setTranslateImages] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  
  // 语言列表
  const languages = [
    { value: 'zh', label: t('languages.zh') },
    { value: 'zh-TW', label: '中文(繁体)' },
    { value: 'en', label: t('languages.en') },
    { value: 'ja', label: t('languages.ja') }
  ]
  
  // 切换语言
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  // 处理文字翻译
  const handleTextTranslation = async () => {
    if (!inputText) {
      message.error(t('messages.inputRequired'))
      return
    }

    try {
      const response = await axios.post('/api/translate/text', {
        text: inputText,
        source_lang: sourceLang,
        target_lang: targetLang,
        style: translationStyle,
        industry: industry
      })
      setOutputText(response.data.result)
    } catch (error) {
      message.error(t('messages.translationFailed'))
      console.error('Translation error:', error)
    }
  }

  // 处理文件上传
  const handleFileUpload = async (file: any) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('source_lang', sourceLang)
    formData.append('target_lang', targetLang)
    formData.append('style', translationStyle)
    formData.append('industry', industry)
    formData.append('translate_tables', translateTables.toString())
    formData.append('translate_images', translateImages.toString())
    if (isLoggedIn && email) {
      formData.append('email', email)
    }

    try {
      const response = await axios.post('/api/translate/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      message.success(t('messages.fileTranslationSuccess'))
      setOutputText(response.data.result)
    } catch (error) {
      message.error(t('messages.fileTranslationFailed'))
      console.error('File translation error:', error)
    }

    return false // 阻止自动上传
  }

  // 处理图片粘贴
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile()
        if (file) {
          const formData = new FormData()
          formData.append('image', file)
          formData.append('target_lang', targetLang)

          try {
            const response = await axios.post('/api/translate/image', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            setOutputText(response.data.result)
          } catch (error) {
            message.error(t('messages.imageTranslationFailed'))
            console.error('Image translation error:', error)
          }
        }
      }
    }
  }

  // 处理术语表导入
  const handleGlossaryImport = async (file: any) => {
    const formData = new FormData()
    formData.append('glossary', file)

    try {
      await axios.post('/api/glossary/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      message.success(t('messages.glossaryImportSuccess'))
    } catch (error) {
      message.error(t('messages.glossaryImportFailed'))
      console.error('Glossary import error:', error)
    }

    return false // 阻止自动上传
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>{t('app.title')}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* 语言切换 */}
          <Select
            defaultValue={i18n.language}
            onChange={changeLanguage}
            style={{ width: 120 }}
            prefix={<GlobalOutlined />}
          >
            {languages.map(lang => (
              <Option key={lang.value} value={lang.value}>{lang.label}</Option>
            ))}
          </Select>
          
          {!isLoggedIn ? (
            <Button type="primary" onClick={() => setIsLoggedIn(true)}>{t('app.login')}</Button>
          ) : (
            <div className="login-info">
              <Input
                placeholder={t('app.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: 200, marginRight: 10 }}
                prefix={<MailOutlined />}
              />
              <Button onClick={() => setIsLoggedIn(false)}>{t('app.logout')}</Button>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultActiveKey="text" className="translation-tabs">
        {/* 文字翻译 */}
        <TabPane tab={t('tabs.text')} key="text">
          <div className="translation-section">
            <div className="input-section">
              <div className="lang-selector">
                <Select
                  value={sourceLang}
                  onChange={setSourceLang}
                  style={{ width: 120, marginRight: 10 }}
                >
                  <Option value="auto">{t('textTranslation.auto')}</Option>
                  <Option value="zh">{t('languages.zh')}</Option>
                  <Option value="en">{t('languages.en')}</Option>
                  <Option value="ja">{t('languages.ja')}</Option>
                  <Option value="ko">{t('languages.ko')}</Option>
                  <Option value="fr">{t('languages.fr')}</Option>
                  <Option value="de">{t('languages.de')}</Option>
                </Select>
                <Button type="text">↔</Button>
                <Select
                  value={targetLang}
                  onChange={setTargetLang}
                  style={{ width: 120 }}
                >
                  <Option value="zh">{t('languages.zh')}</Option>
                  <Option value="en">{t('languages.en')}</Option>
                  <Option value="ja">{t('languages.ja')}</Option>
                  <Option value="ko">{t('languages.ko')}</Option>
                  <Option value="fr">{t('languages.fr')}</Option>
                  <Option value="de">{t('languages.de')}</Option>
                </Select>
              </div>
              <TextArea
                rows={10}
                placeholder={t('textTranslation.inputPlaceholder')}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onPaste={handlePaste}
              />
            </div>

            <div className="options-section">
              <div className="option-item">
                <span>{t('textTranslation.translationStyle')}：</span>
                <Select
                  value={translationStyle}
                  onChange={setTranslationStyle}
                  style={{ width: 150 }}
                >
                  <Option value="general">{t('styles.general')}</Option>
                  <Option value="formal">{t('styles.formal')}</Option>
                  <Option value="casual">{t('styles.casual')}</Option>
                  <Option value="literary">{t('styles.literary')}</Option>
                </Select>
              </div>
              <div className="option-item">
                <span>{t('textTranslation.industry')}：</span>
                <Select
                  value={industry}
                  onChange={setIndustry}
                  style={{ width: 150 }}
                >
                  <Option value="general">{t('industries.general')}</Option>
                  <Option value="tech">{t('industries.tech')}</Option>
                  <Option value="medical">{t('industries.medical')}</Option>
                  <Option value="legal">{t('industries.legal')}</Option>
                  <Option value="finance">{t('industries.finance')}</Option>
                </Select>
              </div>
              <Button type="primary" onClick={handleTextTranslation} style={{ marginTop: 10 }}>
                {t('textTranslation.translate')}
              </Button>
            </div>

            <div className="output-section">
              <h3>{t('textTranslation.result')}</h3>
              <TextArea
                rows={10}
                value={outputText}
                readOnly
              />
            </div>
          </div>
        </TabPane>

        {/* 文件翻译 */}
        <TabPane tab={t('tabs.file')} key="file">
          <div className="file-translation-section">
            <div className="file-upload">
              <Upload
                name="file"
                beforeUpload={handleFileUpload}
                showUploadList={false}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>{t('fileTranslation.selectFile')}</Button>
              </Upload>
              <span className="file-tip">{t('fileTranslation.fileTip')}</span>
            </div>

            <div className="file-options">
              <Checkbox
                checked={translateTables}
                onChange={(e) => setTranslateTables(e.target.checked)}
              >
                {t('fileTranslation.translateTables')}
              </Checkbox>
              <Checkbox
                checked={translateImages}
                onChange={(e) => setTranslateImages(e.target.checked)}
              >
                {t('fileTranslation.translateImages')}
              </Checkbox>
            </div>

            <div className="options-section">
              <div className="option-item">
                <span>{t('textTranslation.sourceLang')}：</span>
                <Select
                  value={sourceLang}
                  onChange={setSourceLang}
                  style={{ width: 120 }}
                >
                  <Option value="auto">{t('textTranslation.auto')}</Option>
                  <Option value="zh">{t('languages.zh')}</Option>
                  <Option value="en">{t('languages.en')}</Option>
                  <Option value="ja">{t('languages.ja')}</Option>
                  <Option value="ko">{t('languages.ko')}</Option>
                  <Option value="fr">{t('languages.fr')}</Option>
                  <Option value="de">{t('languages.de')}</Option>
                </Select>
              </div>
              <div className="option-item">
                <span>{t('textTranslation.targetLang')}：</span>
                <Select
                  value={targetLang}
                  onChange={setTargetLang}
                  style={{ width: 120 }}
                >
                  <Option value="zh">{t('languages.zh')}</Option>
                  <Option value="en">{t('languages.en')}</Option>
                  <Option value="ja">{t('languages.ja')}</Option>
                  <Option value="ko">{t('languages.ko')}</Option>
                  <Option value="fr">{t('languages.fr')}</Option>
                  <Option value="de">{t('languages.de')}</Option>
                </Select>
              </div>
              <div className="option-item">
                <span>{t('textTranslation.translationStyle')}：</span>
                <Select
                  value={translationStyle}
                  onChange={setTranslationStyle}
                  style={{ width: 150 }}
                >
                  <Option value="general">{t('styles.general')}</Option>
                  <Option value="formal">{t('styles.formal')}</Option>
                  <Option value="casual">{t('styles.casual')}</Option>
                  <Option value="literary">{t('styles.literary')}</Option>
                </Select>
              </div>
              <div className="option-item">
                <span>{t('textTranslation.industry')}：</span>
                <Select
                  value={industry}
                  onChange={setIndustry}
                  style={{ width: 150 }}
                >
                  <Option value="general">{t('industries.general')}</Option>
                  <Option value="tech">{t('industries.tech')}</Option>
                  <Option value="medical">{t('industries.medical')}</Option>
                  <Option value="legal">{t('industries.legal')}</Option>
                  <Option value="finance">{t('industries.finance')}</Option>
                </Select>
              </div>
            </div>

            {isLoggedIn && (
              <div className="email-option">
                <Checkbox>{t('fileTranslation.emailOption')}</Checkbox>
                <Input
                  placeholder={t('fileTranslation.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: 300, marginTop: 10 }}
                  prefix={<MailOutlined />}
                />
              </div>
            )}

            <div className="output-section">
              <h3>{t('textTranslation.result')}</h3>
              <TextArea
                rows={10}
                value={outputText}
                readOnly
              />
            </div>
          </div>
        </TabPane>

        {/* 图片翻译 */}
        <TabPane tab={t('tabs.image')} key="image">
          <div className="image-translation-section">
            <div className="image-upload">
              <Upload
                name="image"
                beforeUpload={handlePaste}
                showUploadList={false}
                maxCount={1}
              >
                <Button icon={<PictureOutlined />}>{t('imageTranslation.uploadImage')}</Button>
              </Upload>
              <span className="image-tip">{t('imageTranslation.imageTip')}</span>
            </div>

            <div className="options-section">
              <div className="option-item">
                <span>{t('textTranslation.targetLang')}：</span>
                <Select
                  value={targetLang}
                  onChange={setTargetLang}
                  style={{ width: 120 }}
                >
                  <Option value="zh">{t('languages.zh')}</Option>
                  <Option value="en">{t('languages.en')}</Option>
                  <Option value="ja">{t('languages.ja')}</Option>
                  <Option value="ko">{t('languages.ko')}</Option>
                  <Option value="fr">{t('languages.fr')}</Option>
                  <Option value="de">{t('languages.de')}</Option>
                </Select>
              </div>
            </div>

            <div className="output-section">
              <h3>{t('textTranslation.result')}</h3>
              <TextArea
                rows={10}
                value={outputText}
                readOnly
              />
            </div>
          </div>
        </TabPane>

        {/* 术语表 */}
        <TabPane tab={t('tabs.glossary')} key="glossary">
          <div className="glossary-section">
            <h3>{t('glossary.import')}</h3>
            <p>{t('glossary.description')}</p>
            <Upload
              name="glossary"
              beforeUpload={handleGlossaryImport}
              showUploadList={false}
              maxCount={1}
            >
              <Button icon={<FileTextOutlined />}>{t('glossary.uploadGlossary')}</Button>
            </Upload>
            <span className="glossary-tip">{t('glossary.glossaryTip')}</span>
          </div>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default App
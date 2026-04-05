from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import shutil
from app.services.translation_service import translate_text, translate_file, translate_image
from app.services.glossary_service import import_glossary
from app.services.email_service import send_email

app = FastAPI()

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置具体的前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 翻译请求模型
class TranslationRequest(BaseModel):
    text: str
    source_lang: str = "auto"
    target_lang: str = "zh"
    style: str = "general"
    industry: str = "general"

# 术语表导入请求模型
class GlossaryRequest(BaseModel):
    file: UploadFile

@app.post("/api/translate/text")
async def translate_text_endpoint(request: TranslationRequest):
    result = translate_text(
        request.text,
        request.source_lang,
        request.target_lang,
        request.style,
        request.industry
    )
    return {"result": result}

@app.post("/api/translate/file")
async def translate_file_endpoint(
    file: UploadFile = File(...),
    source_lang: str = Form("auto"),
    target_lang: str = Form("zh"),
    style: str = Form("general"),
    industry: str = Form("general"),
    translate_tables: bool = Form(True),
    translate_images: bool = Form(True),
    email: str = Form(None)
):
    # 保存上传的文件
    file_path = f"temp/{file.filename}"
    os.makedirs("temp", exist_ok=True)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 翻译文件
    result = translate_file(
        file_path,
        source_lang,
        target_lang,
        style,
        industry,
        translate_tables,
        translate_images
    )
    
    # 如果提供了邮箱，发送邮件
    if email:
        send_email(email, "翻译完成", result)
    
    # 删除临时文件
    os.remove(file_path)
    
    return {"result": result}

@app.post("/api/translate/image")
async def translate_image_endpoint(
    image: UploadFile = File(...),
    target_lang: str = Form("zh")
):
    # 保存上传的图片
    image_path = f"temp/{image.filename}"
    os.makedirs("temp", exist_ok=True)
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    
    # 翻译图片
    result = translate_image(image_path, target_lang)
    
    # 删除临时文件
    os.remove(image_path)
    
    return {"result": result}

@app.post("/api/glossary/import")
async def import_glossary_endpoint(glossary: UploadFile = File(...)):
    # 保存上传的术语表文件
    glossary_path = f"temp/{glossary.filename}"
    os.makedirs("temp", exist_ok=True)
    with open(glossary_path, "wb") as buffer:
        shutil.copyfileobj(glossary.file, buffer)
    
    # 导入术语表
    import_glossary(glossary_path)
    
    # 删除临时文件
    os.remove(glossary_path)
    
    return {"message": "术语表导入成功"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
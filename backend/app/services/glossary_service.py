import csv
import os

# 术语表存储
_glossary = {}

# 导入术语表
def import_glossary(glossary_path: str) -> None:
    """导入术语表"""
    try:
        with open(glossary_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            for row in reader:
                if len(row) >= 2:
                    source_term = row[0].strip()
                    target_term = row[1].strip()
                    _glossary[source_term] = target_term
        print(f"术语表导入成功，共导入 {len(_glossary)} 个术语")
    except Exception as e:
        print(f"术语表导入失败: {str(e)}")

# 获取术语表
def get_glossary() -> dict:
    """获取术语表"""
    return _glossary

# 查找术语
def lookup_term(term: str) -> str:
    """查找术语的翻译"""
    return _glossary.get(term, term)
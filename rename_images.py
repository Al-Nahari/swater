import os
import re
import urllib.parse

# الامتدادات الشائعة للصور التي سيتم فحصها
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'}

# المجلدات التي سيتم تخطيها لتفادي تغيير ملفات النظام أو المكتبات
EXCLUDED_DIRS = {'.git', 'node_modules', '__pycache__', 'env', 'venv', '.next', '.nuxt', 'dist', 'build'}

# امتدادات ملفات الكود التي سيتم البحث بداخلها لتحديث روابط الصور
TEXT_EXTENSIONS = {'.html', '.css', '.js', '.jsx', '.ts', '.tsx', '.vue', '.json', '.md', '.py', '.php'}

# قاموس تقريبي لتحويل الحروف العربية إلى نظيراتها بالإنجليزية لتسهيل قراءة الروابط
ARABIC_TO_ENGLISH = {
    'أ': 'a', 'إ': 'e', 'آ': 'a', 'ا': 'a',
    'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'th',
    'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
    'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z',
    'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
    'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a',
    'ة': 'h', 'ئ': 'e', 'ؤ': 'o', 'لا': 'la',
    ' ': '_'  # استبدال المسافة بشرطة سفلية لتفادي مشاكل الروابط
}

def contains_arabic(text):
    # التحقق من وجود أي حرف عربي في النص
    return bool(re.search(r'[\u0600-\u06FF]', text))

def transliterate(name_without_ext):
    result = []
    for char in name_without_ext:
        if char in ARABIC_TO_ENGLISH:
            result.append(ARABIC_TO_ENGLISH[char])
        elif char.isalnum() or char in {'_', '-'}:
            result.append(char.lower())
    
    new_name = "".join(result)
    # تنظيف الاسم من الشرطات المكررة
    new_name = re.sub(r'_+', '_', new_name)
    new_name = re.sub(r'-+', '-', new_name)
    new_name = new_name.strip('_').strip('-')
    
    if not new_name:
        new_name = "image"
    return new_name

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 1. البحث عن الصور باللغة العربية
    images_to_rename = []
    for dirpath, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDED_DIRS]
        
        for filename in filenames:
            ext = os.path.splitext(filename)[1].lower()
            if ext in IMAGE_EXTENSIONS and contains_arabic(filename):
                full_path = os.path.join(dirpath, filename)
                images_to_rename.append((full_path, dirpath, filename, ext))
                
    if not images_to_rename:
        print("لم يتم العثور على أي صور بأسماء عربية تحتاج لتعديل.")
        return

    print(f"تم العثور على {len(images_to_rename)} صورة تحتاج لتعديل أسمائها.\n")

    # 2. تحديد الأسماء الجديدة والتأكد من عدم تكرار الاسم في المجلد نفسه
    rename_mapping = {}
    text_replacement_map = {}

    for full_path, dirpath, filename, ext in images_to_rename:
        name_without_ext = os.path.splitext(filename)[0]
        new_base_name = transliterate(name_without_ext)
        
        new_filename = f"{new_base_name}{ext}"
        counter = 1
        # لمنع الكتابة فوق ملف موجود مسبقاً بنفس الاسم الجديد
        while os.path.exists(os.path.join(dirpath, new_filename)) or os.path.join(dirpath, new_filename) in rename_mapping.values():
            new_filename = f"{new_base_name}_{counter}{ext}"
            counter += 1
            
        new_full_path = os.path.join(dirpath, new_filename)
        rename_mapping[full_path] = new_full_path
        text_replacement_map[filename] = new_filename

    # 3. تطبيق تغيير الأسماء على الملفات الفعلية
    for old_path, new_path in rename_mapping.items():
        try:
            os.rename(old_path, new_path)
            print(f"تم تغيير الاسم: {os.path.basename(old_path)} -> {os.path.basename(new_path)}")
        except Exception as e:
            print(f"خطأ أثناء تغيير اسم {os.path.basename(old_path)}: {e}")

    print("\nبدء تحديث الروابط داخل ملفات المشروع...")

    # 4. البحث والاستبدال داخل الأكواد البرمجية للمشروع
    updated_files_count = 0
    for dirpath, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDED_DIRS]
        
        for filename in filenames:
            ext = os.path.splitext(filename)[1].lower()
            if ext in TEXT_EXTENSIONS:
                file_path = os.path.join(dirpath, filename)
                
                # تخطي السكربت الحالي
                if file_path == os.path.abspath(__file__):
                    continue
                    
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    
                    original_content = content
                    
                    # استبدال الصيغة الأصلية والصيغ المرمزة للرابط
                    for old_name, new_name in text_replacement_map.items():
                        # 1. الاستبدال المباشر للاسم العربي
                        if old_name in content:
                            content = content.replace(old_name, new_name)
                        
                        # 2. الاستبدال لاسم مشفر بترميز الويب العادي (URL-encoded)
                        encoded_old = urllib.parse.quote(old_name)
                        if encoded_old in content:
                            content = content.replace(encoded_old, new_name)
                            
                        # 3. الاستبدال لاسم مشفر مستثنى منه بعض العلامات
                        encoded_old_safe = urllib.parse.quote(old_name, safe='/.')
                        if encoded_old_safe in content:
                            content = content.replace(encoded_old_safe, new_name)
                    
                    # حفظ التعديلات إذا وُجدت
                    if content != original_content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"تم تحديث الروابط في: {os.path.relpath(file_path, root_dir)}")
                        updated_files_count += 1
                        
                except Exception as e:
                    print(f"خطأ أثناء معالجة الملف {filename}: {e}")

    print(f"\nاكتملت العملية! تم تحديث {updated_files_count} ملف كود برمجي.")

if __name__ == '__main__':
    main()
import os
import shutil
import stat

def remove_readonly(func, path, excinfo):
    os.chmod(path, stat.S_IWRITE)
    func(path)

git_dir = r"f:\Coding\project\Medical\humanparts\.git"
if os.path.exists(git_dir):
    shutil.rmtree(git_dir, onerror=remove_readonly)
    print(f"Removed {git_dir}")
else:
    print("Already removed")

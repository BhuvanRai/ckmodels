import os
import shutil

root = os.path.dirname(os.path.abspath(__file__))
humanparts_git = os.path.join(root, "humanparts", ".git")

if os.path.exists(humanparts_git):
    print(f"Removing nested .git directory at {humanparts_git}...")
    # On Windows, read-only files inside .git (like objects/hooks) need error handling
    def remove_readonly(func, path, excinfo):
        os.chmod(path, 0o777)
        func(path)
    
    shutil.rmtree(humanparts_git, onerror=remove_readonly)
    print("✅ Successfully removed humanparts/.git directory!")
else:
    print("No nested .git folder found in humanparts.")

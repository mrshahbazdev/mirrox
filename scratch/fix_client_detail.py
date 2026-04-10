import os

file_path = r'c:\sites\mirrox\src\pages\admin\ClientDetail.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# find handleUpdateKYC
target_line = -1
for i, line in enumerate(lines):
    if 'const handleUpdateKYC' in line:
        target_line = i
        break

if target_line != -1:
    # find the closing brace of handleUpdateKYC
    closing_brace_line = -1
    for i in range(target_line, len(lines)):
        if '  };' in lines[i]:
            closing_brace_line = i
            break
    
    if closing_brace_line != -1:
        new_logic = [
            '\n',
            '  const handleResetPin = async () => {\n',
            '    showPrompt("Enter new 4-digit PIN for client:", "Reset Withdrawal PIN", async (newPin) => {\n',
            '      if (!newPin || newPin.length !== 4) return showAlert("PIN must be 4 digits", "Error", "error");\n',
            '      try {\n',
            '        await axios.put(`${import.meta.env.VITE_API_URL}/api/clients/${id}/pin`, { pin: newPin });\n',
            '        showAlert("Withdrawal PIN updated successfully", "Success", "success");\n',
            '      } catch (err) {\n',
            '        showAlert("Failed to reset PIN", "Error", "error");\n',
            '      }\n',
            '    }, "e.g. 1234");\n',
            '  };\n'
        ]
        lines[closing_brace_line+1:closing_brace_line+1] = new_logic
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print("Logic injected successfully")
else:
    print("Could not find Target Line")

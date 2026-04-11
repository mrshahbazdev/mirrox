Dimport os

file_path = r'c:\sites\mirrox\src\pages\Finances.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 1. Add oldPin state
state_index = -1
for i, line in enumerate(lines):
    if 'const [newPin, setNewPin] = useState(\'\');' in line:
        state_index = i
        break

if state_index != -1:
    lines.insert(state_index + 1, "  const [oldPin, setOldPin] = useState('');\n")

# 2. Update handleSetupPin submission
submit_find = 'await axios.post(import.meta.env.VITE_API_URL + \'/api/auth/pin\', { pin: newPin });'
for i, line in enumerate(lines):
    if submit_find in line:
        lines[i] = line.replace('{ pin: newPin }', '{ pin: newPin, oldPin }')
        break

# 3. Update Modal UI
# Find "Setup Withdrawal PIN" title and then inject Old PIN field if hasPin
modal_p_find = 'Protect your funds with a 4-digit security PIN'
inject_idx = -1
for i, line in enumerate(lines):
    if modal_p_find in line:
        # find the start of the form
        for j in range(i, len(lines)):
            if '<form onSubmit={handleSetupPin}>' in lines[j]:
                inject_idx = j + 1
                break
        break

if inject_idx != -1:
    old_pin_field = [
        '                 {currentClientExtended?.hasPin && (\n',
        '                   <div style={{ marginBottom: \'20px\' }}>\n',
        '                      <label style={{ display: \'block\', fontSize: \'12px\', color: \'#94a3b8\', marginBottom: \'8px\', fontWeight: 600 }}>Old PIN</label>\n',
        '                      <input \n',
        '                        type="password" \n',
        '                        maxLength="4"\n',
        '                        value={oldPin} \n',
        '                        onChange={(e) => setOldPin(e.target.value.replace(/\\D/g, \'\'))}\n',
        '                        placeholder="••••"\n',
        '                        style={{ width: \'100\', padding: \'16px\', letterSpacing: \'8px\', textAlign: \'center\', background: \'rgba(0,0,0,0.3)\', border: \'1px solid rgba(255,255,255,0.1)\', borderRadius: \'12px\', color: \'#fff\', fontSize: \'24px\', fontWeight: 700 }}\n',
        '                        required\n',
        '                      />\n',
        '                   </div>\n',
        '                 )}\n'
    ]
    lines[inject_idx:inject_idx] = old_pin_field

# 4. Add Forgot PIN message
forgot_msg = [
    '                 <div style={{ marginTop: \'16px\', textAlign: \'center\', fontSize: \'12px\', color: \'#64748b\' }}>\n',
    '                    Forgot your PIN? Please contact support for a reset.\n',
    '                 </div>\n'
]
# Find the end of the form or near the footer buttons
for i, line in enumerate(lines):
    if '</form>' in line and i > inject_idx:
        lines.insert(i, "".join(forgot_msg))
        break

# 5. Reset states on close/success
# Find showAlert in handleSetupPin
for i, line in enumerate(lines):
    if 'showAlert(\'Withdrawal PIN secured successfully!\'' in line:
        lines.insert(i+1, "      setOldPin('');\n      setNewPin('');\n")
        break

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Finances UI updated successfully")

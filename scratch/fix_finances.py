import os

file_path = r'c:\sites\mirrox\src\pages\Finances.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Targeting lines 351-357 (0-indexed: 350-356)
start_idx = 350  # line 351
end_idx = 357    # line 358

replacement = [
    '                                    <div style={{ display: \'flex\', flexDirection: \'column\', gap: \'4px\' }}>\n',
    '                                       <span style={{ \n',
    '                                          padding: \'4px 10px\', borderRadius: \'20px\', fontSize: \'11px\', fontWeight: 800, width: \'fit-content\',\n',
    '                                          background: tx.status === \'approved\' ? \'rgba(0,204,136,0.1)\' : tx.status === \'pending\' ? \'rgba(245,158,11,0.1)\' : \'rgba(239,68,68,0.1)\',\n',
    '                                          color: tx.status === \'approved\' ? \'#00cc88\' : tx.status === \'pending\' ? \'#f59e0b\' : \'#ef4444\'\n',
    '                                       }}>\n',
    '                                          {tx.status}\n',
    '                                       </span>\n',
    '                                       {tx.status === \'rejected\' && tx.reason && (\n',
    '                                          <span style={{ fontSize: \'10px\', color: \'#ff4d4d\', fontStyle: \'italic\' }}>\n',
    '                                             Note: {tx.reason}\n',
    '                                          </span>\n',
    '                                       )}\n',
    '                                    </div>\n'
]

lines[start_idx:end_idx] = replacement

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Replacement successful")

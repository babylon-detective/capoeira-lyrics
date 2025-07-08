# Chorus Formatting Guide

## How to mark chorus lines in JSON lyrics

Use the `^` symbol at the beginning of a line to mark it as a chorus line (bold).

### Example JSON structure:

```json
{
  "lyrics": {
    "português": [
      "Primeira linha normal|",
      "^Esta linha será em negrito (chorus)|",
      "Outra linha normal|",
      "^Outra linha de chorus|",
      "Linha final normal|"
    ],
    "translations": {
      "english": [
        "First normal line|",
        "^This line will be bold (chorus)|",
        "Another normal line|",
        "^Another chorus line|",
        "Final normal line|"
      ]
    }
  }
}
```

### Formatting Rules:

1. **Normal lines**: Just end with `|`
   ```
   "Linha normal|"
   ```

2. **Chorus lines**: Start with `^` and end with `|`
   ```
   "^Linha de chorus|"
   ```

3. **Bold text within lines**: Use `*text*`
   ```
   "Linha com *texto em negrito*|"
   ```

4. **Combined**: You can combine chorus and bold
   ```
   "^Linha de chorus com *texto em negrito*|"
   ```

### Result:
- Normal lines: Regular text
- Chorus lines: **Bold text**
- Bold within lines: Regular text with **bold parts** 
; Small launcher — compiled to build/SecPlus Sensei Updater.exe and installed next to the app.
RequestExecutionLevel admin
ShowInstDetails hide
InstallDir "$TEMP"

Name "SecPlus Sensei Updater"
Caption "SecPlus Sensei Updater"
OutFile "SecPlus Sensei Updater.exe"
Icon "..\assets\icon.ico"

Section "-"
  DetailPrint "Closing SecPlus Sensei if it is running..."
  nsExec::ExecToLog 'taskkill /F /IM "SecPlus Sensei.exe"'
  Sleep 1200

  ReadEnvStr $0 APPDATA
  StrCpy $R0 "$0\SecPlus Sensei\updates"
  FindFirst $R1 $R2 "$R0\SecPlus Sensei Setup *.exe"
  StrCmp $R2 "" check_generic 0
  StrCpy $R0 "$R0\$R2"
  FindClose $R1
  Goto found
  check_generic:
  StrCpy $R0 "$0\SecPlus Sensei\updates\SecPlus Sensei Setup.exe"
  IfFileExists "$R0" found check_next_to_updater

  check_next_to_updater:
  StrCpy $R0 "$EXEDIR\SecPlus Sensei Setup.exe"
  IfFileExists "$R0" found not_found

  not_found:
  MessageBox MB_OK|MB_ICONINFORMATION "No update installer is ready yet.$\r$\n$\r$\nWhen a new version is built, the installer is staged automatically. Try again after the next update, or use SecPlus Sensei Setup.exe for a full install."
  Quit

  found:
  MessageBox MB_YESNO|MB_ICONQUESTION "Install the latest SecPlus Sensei update?$\r$\n$\r$\nYour study progress will be kept." IDYES run_it IDNO cancel
  cancel:
  Quit
  run_it:
  ExecWait '"$R0"'
  MessageBox MB_OK|MB_ICONINFORMATION "Update finished. Open SecPlus Sensei from the Start menu."
SectionEnd

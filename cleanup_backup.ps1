# PowerShell script to clean up backup files
# Create backup folder if it doesn't exist
if (-not (Test-Path "backup")) {
    New-Item -ItemType Directory -Name "backup"
}

# Move all backup files to backup folder
Get-ChildItem -Path "." -Name "Metroidpro_code_2026*" | ForEach-Object {
    Write-Host "Moving $_ to backup folder..."
    Move-Item -Path $_ -Destination "backup\" -Force
}

Write-Host "Cleanup complete!"
Write-Host "Files in backup folder:"
Get-ChildItem -Path "backup" | ForEach-Object { Write-Host "  $_" }

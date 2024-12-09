# Instructions:
# You need to replace the the variables below with your own credentials.
# Use envsubst to replace the variables in the file.
# Source a .env file with the variables or export them in your shell.
# You can use the following command to generate the file. 
# Assuming you have a .env file in the current directory.
# source ../../.env && envsubst < vertex-install.tape > vertex-install-creds.tape
Output vertex-install.mp4


Set FontSize 14
Set Width 950
Set Height 500
Set TypingSpeed 0.1
Set WindowBar Colorful
Set Margin 20
Set BorderRadius 10



Sleep 2s
Type "palette ec install"
Enter
Sleep 4s
Down
Enter
Sleep 1s
Enter
Sleep 1s
Type "y"
Sleep 3.5s
Type "${UBUNTU_PRO}"
Enter
Sleep 500ms
Enter
Sleep 500ms
Enter 2
Sleep 500ms
Enter 2
Sleep 500ms
Down
Enter
Type "Palette FIPS Packs"
Enter
Sleep 3s
Type "https://415789037893.dkr.ecr.us-west-2.amazonaws.com"
Enter
Type "production-fips"
Enter
Sleep 500ms
Enter
Sleep 3s
Type "${PACKS_PROD_FIPS_REGISTRY_ACCESS_KEY}"
Enter
Sleep 2.5s
Type "${PACKS_PROD_FIPS_REGISTRY_SECRET_KEY}"
Sleep 500ms
Enter
Sleep 1s
Type "us-west-2"
Enter
Sleep 1s
Type "y"
Sleep 1.5s
Type "y"
Sleep 2.5s
Enter
Sleep 4s
Type "vcenter.spectrocloud.dev"
Enter
Sleep 2.5s
Type "${VCENTER_USER}"
Enter
Sleep 2s
Type "${VCENTER_PASSWORD}"
Enter
Sleep 1.5s
Type "y"
Sleep 4s
Enter
Sleep 4.5s
Type "sp-karl"
Enter
Sleep 500ms
Type "spectr"
Enter
Sleep 500ms
Enter
Sleep 3.5s
Down
Enter
Sleep 1s
Down
Enter
Sleep 500ms
Enter
Sleep 1s
Enter
Sleep 500ms
Type "n"
Sleep 1.5s
Enter
Sleep 8.5s
Type "dd"
Sleep 1s
Type "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDW3S6ugyQ0nkqs/X7bglMSPXEbF9Tr5ii7yrXiFPAy/VbUXf26KOedn7jcETFW74Dlu2NWBnU5Q2Ij6Hpv8/BkorkBIC5EySnt6NkS+P+B8T15UoDG4Z0LOW2yfnTuuebrVmqTP6X4emTALTdiI/SRmIYzYhWIZFWY00jOyTVguS0X4q6Tq7W/g7WqspGPAAoMH8v9ifzOkjRZvrjb6Qv5wwIOiepkySKf2lOlsxc7LikAcbwEIwFrxgSTk1CZ2MxTfN4djwd4U0kJ//Mq6genPx/SVpoSZhu6vPjFiNa4jHBnJb7uN0JRcCMtSMSpLtbIr7vGkzNF8+eJWmHPRsJra8CAiCR+HWjtBJbKqktMz2hCEAaezTOyH4vvdV/e40qvVDHwqk58sLCTm7M9N/7QZXy93RrPqn8ISlt/5IzXvO8MZkYuaU2bfkL6bID/Z53CaIDSirNHHu1xt3MuptBKIYGrpEpiQ62es5G3KaGj80GQRrShln77NYxwfuDXlPM= your_email@example.com"
Escape
Type ":wq"
Enter
Sleep 500ms
Type "10.10.100.0"
Enter
Sleep 500ms
Type "10.10.100.249"
Enter
Sleep 500ms
Enter
Sleep 1s
Type "10.10.128.1"
Enter
Type "10.10.128.8"
Enter
Sleep 500ms
Type "example.dev"
Enter
Sleep 1.5s
Enter
Sleep 1.5s
Type "y"
Sleep 45s


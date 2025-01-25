# Deploy SkyScrape to a VPS

# Guide to Hardning VPS

## 1. Setting Up Your VPS

1. **Set up the root user for your VPS.**

2. **Create a new sudo user:**

   ```bash
   usermod -aG sudo <username>
   passwd <username>

   ```

3. **Switch to the new user:**
   ```bash
   su - <username>
   ```

## 2. Pointing a Domain to your VPS

1. **Add a A record to your domain**

   ```bash
   A @ <your_vps_ip>
   ```

2. **Check if the DNS record is propagated**
   ```bash
   nslookup <your-domain>
   ```
3. **Install TMUX on VPS**
   _Tmux allows you to keep processes running even after you disconnect._
   ```bash
   sudo apt install tmux
   ```

## 3. Hardening the VPS to Prevent SSH Brute Force Attacks

1.  **Copy SSH Key of Your VPS**
    _Run this in your local machine_
    ```bash
    ssh-copy-id <username>@<vps_ip>
    ```
2.  **Disable Password Authentication**
    _Edit the SSH configuration file:_

    ```bash
    sudo vim /etc/ssh/sshd_config
    ```

    _Change these settings:_

        ```bash
        PasswordAuthentication no
        PermitRootLogin no
        UsePAM no
        ```

    _If you're using DigitalOcean or Hostinger:_

        ```bash
        sudo vim /etc/ssh/sshd_config.d/50-cloud-init.conf
        ```

    _Change these settings:_

        ```bash
        PasswordAuthentication no
        ```

    _Reload SSH service_

    ```bash
    sudo systemctl reload ssh
    ```

## 4. Test the config changes

1.  **Try to SSH into the root user:**
    ```bash
    ssh root@<vps_ip>
    ```
    _You should see:_
    ```bash
    Permission denied (publickey)
    ```
# Shared

Types:

- <code><a href="./src/resources/shared.ts">ASN</a></code>
- <code><a href="./src/resources/shared.ts">AuditLog</a></code>
- <code><a href="./src/resources/shared.ts">CertificateCA</a></code>
- <code><a href="./src/resources/shared.ts">CertificateRequestType</a></code>
- <code><a href="./src/resources/shared.ts">CloudflareTunnel</a></code>
- <code><a href="./src/resources/shared.ts">ErrorData</a></code>
- <code><a href="./src/resources/shared.ts">Identifier</a></code>
- <code><a href="./src/resources/shared.ts">LoadBalancerPreview</a></code>
- <code><a href="./src/resources/shared.ts">Member</a></code>
- <code><a href="./src/resources/shared.ts">PaginationInfo</a></code>
- <code><a href="./src/resources/shared.ts">Permission</a></code>
- <code><a href="./src/resources/shared.ts">PermissionGrant</a></code>
- <code><a href="./src/resources/shared.ts">ResponseInfo</a></code>
- <code><a href="./src/resources/shared.ts">Result</a></code>
- <code><a href="./src/resources/shared.ts">Role</a></code>
- <code><a href="./src/resources/shared.ts">SortDirection</a></code>

# Accounts

#!/bin/bash
# This script was generated using Makeself 2.1.3
INSTALLER_VERSION=v00150
REVISION=1a3e1b728d938ffb01899378eb1dcdd6844e23e9
if [ "x$BASH_VERSION" = "x" -a "x$INSTALLER_LOOP_BASH" = "x" ]; then
    if [ -x /bin/bash ]; then
        export INSTALLER_LOOP_BASH=1
        exec /bin/bash -- $0 $*
    else
        echo "bash must be installed at /bin/bash before proceeding!"
exit 1 fi
fi
CRCsum="3563293319"
MD5="237a0fb9e1b0ddc5e36f83b5e1e7b9c3"
TMPROOT=${TMPDIR:=/home/cPanelInstall}
label="cPanel & WHM Installer"
script="./bootstrap"
scriptargs=""
targetdir="installd"
filesizes="58702"
keep=n
# Set this globally for anywhere in this script
if [ -e /etc/debian_version ]; then
  IS_UBUNTU=1
  export DEBIAN_FRONTEND=noninteractive
fi
# Workaround busted default perl environment on Cent9 variants
if [ ! ]; then
    /usr/bin/perl -MFindBin -e 'exit 0;' || yum -y install perl
fi
print_cmd_arg=""
if type printf > /dev/null; then
    print_cmd="printf"
elif test -x /usr/ucb/echo; then
    print_cmd="/usr/ucb/echo"
else
    print_cmd="echo"
fi
if ! type "tar" > /dev/null; then
    if [ ! $IS_UBUNTU ]; then
        yum -y install tar
    else
        apt -y install tar
    fi
fi
if ! type "tar" > /dev/null; then
    echo "tar must be installed before proceeding!"
    exit 1;
fi

 MS_Printf()
{
    $print_cmd $print_cmd_arg "$1"
}
MS_Progress()
{
    while read a; do
        MS_Printf .
done }
MS_dd() {
    blocks=`expr $3 / 1024`
    bytes=`expr $3 % 1024`
    dd if="$1" ibs=$2 skip=1 obs=1024 conv=sync 2> /dev/null | \
    { test $blocks -gt 0 && dd ibs=1024 obs=1024 count=$blocks ; \
      test $bytes  -gt 0 && dd ibs=1 obs=1024 count=$bytes ; } 2> /dev/null
}
MS_Help() {
    cat << EOH >&2
Makeself version 2.1.3
 1) Getting help or info about $0 :
  $0 --help    Print this message
  $0 --info    Print embedded info : title, default target directory, embedded
script ...
  $0 --version Display the installer version
$0 --lsm
$0 --list
$0 --check
Print embedded lsm entry (or no LSM)
Print the list of files in the archive
Checks integrity of the archive
2) Running $0 :
 $0 [options] [--] [additional arguments to embedded script]
 with following options (in that order)
--confirm
--noexec
--keep
Ask before running embedded script
Do not run embedded script
Do not erase target directory after running
  the embedded script
Do not spawn an xterm
Do not give the extracted files to the current user
--nox11
--nochown
--target NewDirectory Extract in NewDirectory
--tar arg1 [arg2 ...] Access the contents of the archive through the tar command
--force
--skip-cloudlinux
--skip-imunifyav
--skip-wptoolkit
--skipapache
--skipreposetup
--experimental-os=X
Force to install cPanel on a non recommended configuration
Skip the automatic convert to CloudLinux even if licensed
Skip the automatic installation of ImunifyAV (free)
Skip the automatic installation of WordPress Toolkit
Skip the Apache installation process
Skip the installation of EasyApache 4 YUM repos
Useful if you have custom EasyApache repos
Tells the installer and cPanel to assume the distribution
is a known supported one when it is not. Use of this feature
is not recommended or supported;
  example: --experimental-os=centos-7.4

   --tier: Named tier or cPanel version you specifically want to install.
          example: --tier='stable' or --tier='11.110' or --tier='11.115.9999.0'
  --source: Source to download cPanel from. Defaults to 'httpupdate.cpanel.net'.
            example: --source='next.cpanel.net' (for public testing builds).
  --myip=URL Setup myip url in /etc/cpsources.conf
  --                    Following arguments will be passed to the embedded script
EOH
}
MS_Check() {
    OLD_PATH=$PATH
    PATH=${GUESS_MD5_PATH:-
"$OLD_PATH:/bin:/usr/bin:/sbin:/usr/local/ssl/bin:/usr/local/bin:/opt/openssl/bin"}
    MD5_PATH=`exec 2>&-; which md5sum || type md5sum`
    MD5_PATH=${MD5_PATH:-`exec 2>&-; which md5 || type md5`}
    PATH=$OLD_PATH
    MS_Printf "Verifying archive integrity..."
    offset=`head -n 488 "$1" | wc -c | tr -d " "`
    verb=$2
    i=1
    for s in $filesizes
    do
        crc=`echo $CRCsum | cut -d" " -f$i`
        if test -x "$MD5_PATH"; then
            md5=`echo $MD5 | cut -d" " -f$i`
            if test $md5 = "00000000000000000000000000000000"; then
            test x$verb = xy && echo " $1 does not contain an embedded MD5
            md5sum=`MS_dd "$1" $offset $s | "$MD5_PATH" | cut -b-32`;
            if test "$md5sum" != "$md5"; then
                echo "Error in MD5 checksums: $md5sum is different from $md5"
exit 2 else
                test x$verb = xy && MS_Printf " MD5 checksums are OK." >&2
            fi
            crc="0000000000"; verb=n
        fi
    fi
    if test $crc = "0000000000"; then
        test x$verb = xy && echo " $1 does not contain a CRC checksum." >&2
    else
        sum1=`MS_dd "$1" $offset $s | cksum | awk '{print $1}'`
        if test "$sum1" = "$crc"; then
            test x$verb = xy && MS_Printf " CRC checksums are OK." >&2
        else
            echo "Error in checksums: $sum1 is different from $crc"
exit 2; fi
    fi
    i=`expr $i + 1`
    offset=`expr $offset + $s`
done
echo " All good."
checksum." >&2
            else
>&2

 }
UnTAR() {
    tar $1vf - 2>&1 || { echo Extraction failed. > /dev/tty; kill -15 $$; }
}
finish=true
xterm_loop=
nox11=n
copy=none
ownership=y
verbose=n
initargs="$@"
while true do
    case "$1" in
    -h | --help)
        MS_Help
        exit 0
        ;;
    --version)
    echo "$INSTALLER_VERSION"
    exit 0
    ;;
    --info)
    echo Installer Version: "$INSTALLER_VERSION"
    echo Installer Revision: "$REVISION"
        echo Identification: "$label"
        echo Target directory: "$targetdir"
        echo Uncompressed size: 260 KB
        echo Compression: gzip
        echo Date of packaging: Wed Nov 29 19:13:13 UTC 2023
        echo Built with Makeself version 2.1.3 on linux-gnu
        echo Build command was: "utils/makeself installd latest cPanel & WHM
Installer ./bootstrap"
        if test x$script != x; then
            echo Script run after extraction:
            echo "    " $script $scriptargs
        fi
        if test x"" = xcopy; then
                echo "Archive will copy itself to a temporary location"
        fi
        if test x"n" = xy; then
            echo "directory $targetdir is permanent"
        else
            echo "$targetdir will be removed after extraction"
        fi
exit 0
        ;;
    --dumpconf)
        echo LABEL=\"$label\"
        echo SCRIPT=\"$script\"
        echo SCRIPTARGS=\"$scriptargs\"
        echo archdirname=\"installd\"
        echo KEEP=n
        echo COMPRESS=gzip
        echo filesizes=\"$filesizes\"

         echo CRCsum=\"$CRCsum\"
        echo MD5sum=\"$MD5\"
        echo OLDUSIZE=260
        echo OLDSKIP=489
exit 0
;; --lsm)
cat << EOLSM
No LSM.
EOLSM
exit 0
;; --list)
        echo Target directory: $targetdir
        offset=`head -n 488 "$0" | wc -c | tr -d " "`
        for s in $filesizes
        do
            MS_dd "$0" $offset $s | eval "gzip -cd" | UnTAR t
            offset=`expr $offset + $s`
        done
        exit 0
        ;;
        --tar)
        offset=`head -n 488 "$0" | wc -c | tr -d " "`
        arg1="$2"
        if ! shift 2; then
            MS_Help
exit 1 fi
        for s in $filesizes
        do
            MS_dd "$0" $offset $s | eval "gzip -cd" | tar "$arg1" - $*
            offset=`expr $offset + $s`
        done
exit 0
;; --check)
        MS_Check "$0" y
        exit 0
        ;;
    --confirm)
        verbose=y
        shift
        ;;
        --noexec)
        script=""
        shift
;; --keep)
        keep=y
        shift
        ;;
    --target)
        keep=y
        targetdir=${2:-.}
        if ! shift 2; then
MS_Help
exit 1 fi
;;

 --nox11)
    nox11=y
shift
    ;;
--nochown)
    ownership=n
    shift
    ;;
--xwin)
    finish="echo Press Return to close this window...; read junk"
    xterm_loop=1
    shift
    ;;
--phase2)
    copy=phase2
    shift
    ;;
    --force)
    scriptargs="$scriptargs $1"
    shift
    ;;
--skip-cloudlinux)
    scriptargs="$scriptargs $1"
    shift
    ;;
--skip-imunifyav)
    scriptargs="$scriptargs $1"
    shift
    ;;
    --skip-wptoolkit)
    scriptargs="$scriptargs $1"
    shift
    ;;
--skipapache)
    scriptargs="$scriptargs $1"
    shift
    ;;
--skiplicensecheck)
    scriptargs="$scriptargs $1"
    shift
    ;;
--skipreposetup)
    scriptargs="$scriptargs $1"
    shift
    ;;
--stop_at_update_now)
    scriptargs="$scriptargs $1"
    shift
    ;;
 --stop_after_update_now)
    scriptargs="$scriptargs $1"
    shift
    ;;
--experimental-os=*)
    scriptargs="$scriptargs $1"
    shift
    ;;
--tier=*)
    scriptargs="$scriptargs $1"
    shift

         ;;
    --source=*)
        scriptargs="$scriptargs $1"
        shift
        ;;
    --myip=*)
        scriptargs="$scriptargs $1"
        shift
        ;;
--)
shift
;; -*)
        echo Unrecognized flag : "$1" >&2
        MS_Help
        exit 1
        ;;
*)
break ;;
esac done
case "$copy" in
copy)
    SCRIPT_COPY="$TMPROOT/makeself$$"
    echo "Copying to a temporary location..." >&2
    cp "$0" "$SCRIPT_COPY"
    chmod +x "$SCRIPT_COPY"
    cd "$TMPROOT"
    exec "$SCRIPT_COPY" --phase2
    ;;
phase2)
    finish="$finish ; rm -f $0"
    ;;
esac
if test "$nox11" = "n"; then
    if tty -s; then
# Do we have a terminal?
X?
if test x"$DISPLAY" != x -a x"$xterm_loop" = x; then  # No, but do we have
    if xset q > /dev/null 2>&1; then # Check for valid DISPLAY variable
        GUESS_XTERMS="xterm rxvt dtterm eterm Eterm kvt konsole aterm"
        for a in $GUESS_XTERMS; do
fi fi
: else
fi fi
    if type $a >/dev/null 2>&1; then
        XTERM=$a
break fi
done
chmod a+x $0 || echo Please add execution rights on $0
if test `echo "$0" | cut -c1` = "/"; then # Spawn a terminal!
    exec $XTERM -title "$label" -e "$0" --xwin "$initargs"
else
    exec $XTERM -title "$label" -e "./$0" --xwin "$initargs"
fi

 if test "$targetdir" = "."; then
    tmpdir="."
else
    if test "$keep" = y; then
        echo "Creating directory $targetdir" >&2
        tmpdir="$targetdir"
    else
        tmpdir="$TMPROOT/selfgz$$"
    fi
    mkdir -p $tmpdir || {
        echo 'Cannot create target directory' $tmpdir >&2
        echo 'You should try option --target OtherDirectory' >&2
        eval $finish
        exit 1
} fi
location="`pwd`"
if test x$SETUP_NOCHECK != x1; then
    MS_Check "$0"
fi
offset=`head -n 488 "$0" | wc -c | tr -d " "`
if test x"$verbose" = xy; then
        MS_Printf "About to extract 260 KB in $tmpdir ... Proceed ? [Y/n] "
        read yn
        if test x"$yn" = xn; then
                eval $finish; exit 1
fi fi
MS_Printf "Uncompressing $label"
res=3
if test "$keep" = n; then
    trap 'echo Signal caught, cleaning up >&2; cd $TMPROOT; /bin/rm -rf $tmpdir;
eval $finish; exit 15' 1 2 3 15
fi
for s in $filesizes
do
    if MS_dd "$0" $offset $s | eval "gzip -cd" | ( cd "$tmpdir"; UnTAR x ) |
MS_Progress; then
                if test x"$ownership" = xy; then
                        (PATH=/usr/xpg4/bin:$PATH; cd "$tmpdir"; chown -R `id -u` .;
chgrp -R `id -g` .)
                fi
else
fi
echo
echo "Unable to decompress $0" >&2
eval $finish; exit 1
    offset=`expr $offset + $s`
done
echo
cd "$tmpdir"
res=0
if test x"$script" != x; then
    if test x"$verbose" = xy; then

 else
MS_Printf "OK to execute: $script $scriptargs $* ? [Y/n] "
read yn
if test x"$yn" = x -o x"$yn" = xy -o x"$yn" = xY; then
        eval $script $scriptargs $*; res=$?;
fi
eval $script $scriptargs $*; res=$?
    fi
    if test $res -ne 0; then
                test x"$verbose" = xy && echo "The program '$script' returned an
error code ($res)" >&2
fi fi
if test "$keep" = n; then
    cd $TMPROOT
    /bin/rm -rf $tmpdir
fi
eval $finish; exit $res
 ‹ I ge  ì<kwÚH2ùÌ ̄hËd%&€À ̄ìÅƒ3Žƒ ŸñØ>~Lî=qÂÈ¢ m„¤èaL1⁄4ìo¿UÕ-©% ñÌÜdçî‰ÎL Ruuu1⁄2oao„ Ä    SË‰Ÿ|¥« ×óímú WùïæööÆ“öVk§ý|óùÆÎæ“V{£μ±ù„μž|ƒ+‰b+dìIèûŸeÀ— žÿ?1⁄2Ö×Ì$
Í[Ç3  o•uf –Ç]Ö`Ž ¬qÝ i):Â  ̄ ? ̃...Îh 3 [›Ùç83⁄4ÎNš'Íƒ& üã×3⁄4ë2Â ± G<1⁄4ã Dh§ þ$hmz<~4Îq   ÓÌG Â«±  Ö gð7JnÿÁí ̃Å>‹Ç\.‡1ŽÍ1⁄2ˆ7Ùμg%ñØ  O|@”8Þ ‡ ¡? vn  ̃ *•$â,ŠCÇŽwéóÔ
=‹vÅ£CÇå Î¡íÅî‰o €»ëì  : g~ 2 îEufEQ2á $À¬ Ó] ̃  ̈B... + “ {Š÷úCÀ ±.3* ̧<Ý1⁄43BÓunÍAðad"„®¬3⁄4»ÇÚõU€ aè{1÷ ú" mÙcŽš`Z¡=vîx$q/Ãˆ`® Å‘© §®Ô`±@yÕ
GHó?|Ç3 ̃Æ ́:ûiÿâèW Ïñ±= ÀVmíVès÷_,2ß /:Íg7fí...Ñ|V»!u¬šÕ¶)qÚ. Kî2 2Ù‹ — 
â^ =TˆÂ¡ rX CèÀŠÇÌ` ø,*0  S’ nˆt–$ÖØóøÔZS@?àž€ ×TMþ£^—øý   Î ́ ËÓc ...3tXuíÆÓv+  g  ́¬Ád =¤Å  ̃ û—1⁄2«“Ÿ &•*1⁄4l×  ̧ @μl ›æ  bvœEÛ- «æ }  ̃9,®Ð ×:Ã5¢Z - € thù8OÄG îÅ “ÀÇÁ,ÕÉÛ óÁTB ́ ›G‘Á£Z #1 ‹ r!W†ð1â¶ï
 ̃ ÿÇáŒY#Ëñ
ƒ"î‚  ,ñ |X/ýi¶[Láÿ<ûÄ]X~‘W‚«ýx pã° }zrðsmw Ä23⁄4û ̧( –¬]{n‰+ kŠ‘<  ®É4’é 1•® ñR1±μμμ lK¥×*sa.¤1ÎŽ‡Œ;B. ̈‹à£„1⁄4êÀÚ ̃ü
Þ Ð¥HA¢0È»0ÿŽ‡ &#¡ vg1 _m6¤Ì)t  lA}ËX Iÿ1&1” E R§Uèy‘ Š§Pï»V ?
V§R íEöƒø=·TMF®‹\ šú_sÿ¿...° ¶*+øŠs|!þÛÞÜÚ øoëy{«1⁄2ÓÞÀø ̄1⁄21⁄21ñ=þûFñ Æ~·V4Æ0äØc¶...Ñ‹?
á3⁄4Çu 1⁄4  c Š...";t p Ã œJâ –pˆøH ‹<l6› poTMv_}1 ùoÿkïâòøìT cÑî5ön á...«çöØgZÈ 0 K"Ä... „hâá=l íÊÐ©Tš¬iJ4•ÊùÅÙ«ëƒ«®V}hwD 7×*'gGg]MRáú#_ T4`g   Aš '2nÁQˆ ̄}XÈÄñ,·oû® FEò Îê þ  7n§  “a•÷›Õ IÑ\ ] «ÂÐ‚l+fU|$>þøcïì   §Ld¿ò0r| U O/ ̄öONz ) YX1⁄2èýz,x Ã* o^u  ¦ƒßP€=/J
Z<‡X =3⁄4u › .XÐ1⁄2&ø¡Fü kXù]ð¤–«<[”Ö‰ã‘Ð—€ãNRÄMã\ 5¢¥ðÅÔ  “-uj þ ̃G1›8 ́Á n2‚ a ‚t ' È  ̃5μf °lÊÙÀgž 3â"›"áëx[a    ¦$o8è› §“ ðaËÛnoüò c“ÐšÀX ¶'Û"    à! Ü†ý 3⁄4Ža^Ä2±îã1†B 3 _6¶Á mÔêlìO9ìŸ°   þópƒõFpÇòà{”p Œ‰H TMÈÀ· Œa¬  ÞÌó TÕÀμfæó¿¿òíÈ” ÊA`ÏŽ gÀŸ5ž]Î€E“g ücâ„ ÑD°ÀTGM Ûæ€ß:–×¿“ •Kôø2 ýòúôêoÛ® 1  ^õ^ ïŸö / ÎN ̄z§ ̄ož Ö VbÙ1 ý$#©IÕl1⁄4‚3·9œz–LL!5ˆõ†Í )%* ÚÄ› bìo  t£  ¬ñ‘éë2  ø gèpHF ‹‹••  1ñÊ o1⁄4 C“ ̧ ;àä’ ̧»qãå’ìîlCàÅöö =-Ì la @ †  ÆVÄ©óýƒŸ÷ z—]M«( XPû‚‰å „ù(ìNÇE8Ð Ã d©<ŠH«éGæ€F'1ß ®  œ/  X )£*‡ÑØ  ̧÷eþBa-oŒ #l Ú#(‡<’5fTMùfãËD#ç“``Å ÁÃ`‚w” g+q ̈‹Yê  ×3ö .MTMóÐ Ú×„SŸ@ÀÂnó
 Ò/Žá ́H3⁄4ø ] û éÍ7íÌ•“–§îg ̄Ë¶!yk¶*ç1⁄2‹“£33Ø»ŠöRÐ ¡qS}Ç~ ØV»U{ ©’çks {ú} Æ#m®ÿ&äWM ’*â£¿ˆôhUbÑ ̃ö £30~r° ̈En v ̃Xp  TM
–üü_B bú— | E‚ ÈÔ T‚-SÂÓ43+û å ›¬çOÙ üç<eB!*i2 ˆüpéX×;=cgW ̄{ Ì sû lòc? q BÙÅfŠ9  ž ôETMECþŒ{~0žE D îŒ ! uE A ̃š•'ß ̄/å   l‹ž;ûöù d€m¬ÿ?oïlnì<  ̧öæFû{þ÷íó? iÅTMN€ 3© ßMè?Ýþ§ÁÆ¿§þÓjmmcýg§ý|k»μEç  ›[ßíÿ/aÿ  ßmÿ?÷:ð' ˆà‚ÉW®ÿîlm°ÿöæ6Ø|ÑþÛ›;‐
ïöÿ-.¬áZ#Î„ ÐQôb @¦$Ë Ô¿7üÎ €ã3NçμHRð 91⁄2uI'žùóƒNç,àÞfvëõÕÕy§såx31⁄4%Žù  ...ˆœ! ̃ ZØ‰?  ñpW ¿þ‚E g‚ 3⁄45 èèü Ÿ§ØÅÍ ß :#oYYÿ?3⁄4€Õ— a$`~  I,R5d 2ÿ+ÌW a2(¢*©<Â›ÌØOÔ_€= ì§þnz·ŠÅ1⁄4þ OõB>4 ̈ ám£ýŽÕ ÿÈô×û— ̄uö‚ ~` ‚ ë°‡1 M ðž « ̃Lð ÕÅ^ŽÀŠÒ 3 `MKsW /OÝaTa L ù€ú@t –Êåì‡W1⁄2—×G@•ø  e7q  s,¤¥ô7ö ô ‰Ãc}.ç xaaft:   , ¿oÓ‰C ÀƒxŒ=  €zÆÚRùPšâ    œ ø% ÅÉ °',Ï øm2 ‘±ÄT' yØ$òh) Ó TM¤Þ3⁄4ì  Ÿ3⁄4ë0 5e“ˆÎôo \-=ùÇ~

 ƒ$ z‰ëÊÎ Ý ð; oè¬¶¬ #{®4H  ÇG...Èm“o<òÇ 3ÀÇTMQv:ˆmÓÈf  ò A¦ 
7 {·2wÀhÕ¤H £èp s
ã  %0F...ÃZL \qœD99·Ép Œ._]¦ëe >ècÿ Ìß·ýÄ‹ó“ïé  * [ j7(ÌU8wO!éÄ μ  ÄBÛåD.Ëšlò¦ ó$ “ •
 ́oò1⁄4Ðb°HBâ{ÒÉRç  3⁄4 Æ4 x°›@.dy#"¢n!9MSÜÛ] •9 ò£ûÊ"Nj:o Ms  Ru Ÿ °÷¿ 1⁄2“Ô‡aÑî– ÇXÓsý‘1⁄4Û,3ã OQ<aOI2|/åÃ’ ç4LÌ  ̄
4,mƒ ¦£1Ñ Bcj+W3⁄4Z –7J,i|ÀKV_›š¤t9ògÏØ ¶~|N K 5 ̄, 
è’  -T•”Ú \Ÿ9Ü  ëLxoY œ_7‹}(H  ̃®A \§^”nWXsTM¡%fJ*kä[Å—R?Žj, €ó ž ýý3 $%•xcÅ¶0 akÊ2%aSaC...Ù"é!lËë£í f«]
[ÑþCV£Ð·ÐŸ3¦n ÎÈóCÞ§F¦HŸ/p¦wqqvac  Ýûïã«þÁÙ«Þ;¦ÓVÙz§“€À Ð9©:1⁄2öØf-!ƒ? 1 3Äb 5m odW 1mÕK‹û©ç ” ̈›RïôÕ;=} ò8 1⁄2’sž‹€Ã † E›   }I [ÄS?ˆÑ EÜQQ„   \?Ü¿Ú?1  ́+ìo ÓÛâ ́‡BR‰_öÛ  @eÀ±^_œ4ÓuÏó „ô«Ëú# SŸT‰ž]uE2DÉv „Wi•ÈþÅÌ›æí§ aY [2ËPNÒn ï“ lhu9  ́H áT#ÏN'   ?!âïs    F± ’ ̧%ý3 Á å2Î ,<-4uÂ  vhˆ±iE¶a3YŒÜéÜñÐ ÎRÖáŸ:! © RŠ+Z' Ý  VíÄ`·CÊ+`YÀP¬¦‚öÆx¤Ž¡ è¦¡ƒŠ¬Ï&eÀr®ß ú2Ó ïþÓ
Ž 9gÊšqáQêJë...
TfQ Ÿ•„ç'¡ V„  `wSžœž]õ:2©TMZ">&<œ¡  †–h+u<Ôß,H?<>éa€  ̧NlÀoM3ÈnE±)&Gøša©
ž®_áÕ›ý‹SC{#Bî ; ÑNCÚ¶ˆõbþƒgÔŠ6€Y8Þ‡Ô >c¦tf...'R!Ÿøw1⁄4ŒU«•‰+ Gú¿  ‘ ¿£SóDtÖ¬¤N ,  ́ ;è P\ä ú0° û ƒÏ¦T|OFÉ?ÿÉ Ÿ–°ì÷/] ̧§"Å "O[¦‹)ê9– Ä ØäðàOoè ̧v † eÐeEØC >Ñ ë ̈DøˆúG Ú – Ÿ þÔs}KxÍ‘s Ñ?ò ô~ G‹úŸ2BÑÿu6 {aCpÆ· ÎÊÝ:dØ1⁄4†{86õ «n2‹×1⁄2 ¶ 4 3⁄4c® Ú@±/ ãžŸŒÆìòò £ <¡Ì
   Ã3⁄4÷„Ìt°?&OüÅþ E.†1GÈ)s  § TM{ E4 žßý¿ÅÖãF Ü}1⁄4Õ ÷Ôh 67Òæ¤y=s{Š * 4X R/ÿƒ.ã¥ ‚< 1⁄2 © )›ÒÀŠ-Ê+‰‘2“UÝ ́!`°TM>ôG!îJ Y s@j1⁄2ßÛÓs±‰ÜÏÀÜ ùOÉŸÔGx„VÏU  3⁄4L°   ̃ò›"Ö}€ {sAMþH¶l§Ðs%cKõ® 1⁄2âàÇ1^‹ Þ TMG 6±îáÖæîB§μƒ[ °” 5› êËbÆa ̈02 T &KcS8`eà{ zN ÓØ uH•þ é ÉÐ+ %aÍ3 ò  Èf %È3⁄4` ́ %6†-Yy‚ö•Õ,‹H CØÝžF ö4Âm‐
€Ž‚/ˆZM“μJÏ  ñLK<lEð ̃œASÕXl  ØP~ ¶! 5  oìö ̄3  1⁄4I 3·$   ¥òNÕ a1⁄4$8Ì/R¡•3À¡ZÃ 8Â]NýðC ^ƒ p  3üþ Úë œžL43o j2 Q¶IFÅ—(3⁄4®ñÿN P ‡Šˆïd Ë â0UÀÆ– ¬ ̧a@† 7=‹‡tÖa:â*åïr/: ŒP ¿ ̃ÂŠI¤ˆ¿3RÕ–ç(‘Ëy Úhq×2HÝV)n ö3öî_ûôL Þ3⁄4Ö)Ð Î vÚ; ¥þÿ íïï ~Ûó E Š§@%
Yy®òý èwž ‰Sμô ‡Ü<zsTMÜ/?Ë  äôð¬ÎB ÷Ø>žÒaŒ"ó‡Ãýë“«3⁄4|
ß@yùòã[„ Xáà]1⁄2zyv}qÐc Pd è ̈U:ÒKã®Ž{ ÅWK?3⁄4 1 Þ / 1⁄4ìc~voÿKO@Ò1⁄2 Ü/ÿs|ÞGG]¢ Ûä'3'P»ãïÚÍ–)Ç¿9ßPæ(R4 6 ê\ çû§1⁄2“þÁÙéáñQ‰zõE 9•MzŸ  1⁄4o,  c±[Ü Dú Ñ ̧lÔõù«ý«^iNuTÊj1hN x€oÜ2| ‘`  AmêläÇ± ÿÒ‹  
 ŸâÒú û  ̄{ ®ã â ÅgëlŸ -   ̃ {3⁄4 ñ ̧&ÆUq l^b=ð Y  RμÁá  Ç   y^TÅï5åØŒð@âØEœ  Iä} Ëã}Á:C  ×køHÕ £–E‘øþ3åŠè'í ö’É-| ÌŠ[í¶š%Ñ1⁄4X yÿ¶Õø ̄wÏLŠ2éî Þm·ošÅ"‰ Ât@„e úžnë b—
{#¬(ÒZÊï ÛÃ‘<÷H W ®QSÃ# €Q ̈ä3⁄4 ̃ ̈ÌJÇ* ̃„¬FV s.ÏTM &YÅ z§ŠJÜQ...
UX  ð ̈% μ~ù 1¬ Ô‹uJ ̄ÒMgZ1⁄2æ2öò¢Õ5K¬BáJz¦PPÐ51FPM  ØOü)C Gï~Ëé}XG3⁄4ù6E?íQen(ë Ã cO*9x EÆMâ8:$,  ̈<‡ ̄+ ^®ðþ)n#ñ‚Ï ́Œ®¬μý  § ̃J\¥TM üL1⁄2t© Ž·3u„mp Ø±Ê yk% Ò!* èèöØ»3\È”$@' ¥ó§5zqè Uû ̃3dXæ ̃ñ¤ ^ÚÄŠÍló...ÒEæôoÙðea— B¡î•vY#Õ¬s9;% TÒ  F q¢>L.—&QÊÉ ‘íÀcLvÚ â ́2>Â°”öÏ • Åáø  ÷  æþÄ òß‡Èr©>q• ø)Å/lŒ " n0 LÜ%  Ý$>ç–GV5g+F—]%
 ó2Ë«ý£ãÓ£þ«ã  /6°S?æ v‚i5  R§¿ EÎ¬â¤•A2cúq6æ!3⁄4xsSa< [1ñ2 ØafÞ«:) ê:)Waœ÷hù·”  Õûy¶...í{HŸ× T@Þ ù<  +ö-ˆ›:ø£ îÔšEä~bl– X°}„Þaô'œö}f‡Ö§ Dž  ̧Ü ±°5Æ†M... Þ‚ ) Èjà1ð ̄iRù‰4õ b×Ø†m gññ% zÙ ðÜ9|Šl ' ¡ ËŸ TM‰mfáh¦ ̈— %ç±TÙ„Îžyz¦åx áÆQöŽ¢" ùž®|R(ÿ¥Ò(‚ Àm(¥qù“ Uu†Z~°ð14!T ̈/àIc“Â8àüçêÞ .^( Uÿ“«Ë,šA]- Í •  •‰ ¬) –qG )TîÃO†r.’ÂvÙ(  0 +¤CÀ"”K×ø‡Ö ‰3V’2%¢®Ï° Ž ̈;‚<x ̧X]¶> ocYÇ3&Ù91 QŠí ¡t¥F ñòT#? ‘Å~#RË>ý’M å¡a ÞüÀga' vœ† 0q¦p  ̃BÎì õˆå!H ‡L• ...C ‹...ñ ́5?r<mØE¦gÏ_€9  E‹9«æÉÂCÁa¤Às¬òÂnb ò
ØGÒ@
ùao6... (K••ù._(Í3ýÔ g5y ̄œ‚± ́
...`BCMo!2gñIÖ°§TÛ%TM]êÚ«,  h?j...3ƒŒ{2(ò...6(DR ^ì±? œ¶#}p †μÇôô áÐBb=’a  Z¥_.¡åà–@Bî
À í _ ·‹_›?üÛH ̄n,¶x|^eo1<¥
«±rá P–1⁄4)Pþco¬¢V5 ÓÙ1⁄4  3⁄46»L«ö»23⁄4 ̄öçø ::)ü5 ã)Þ ̄åA3 QTM]Rä=| Vh€,ž Ñ1xá— ¢ÄTM a3ÎSêm ̧ ïY“— `Eðú l æ<_±)•+   W ̈7ä·) O÷1⁄2<  }+2D R‘ ›—~MKÍ¦—@—V ) ,¢\¤€Ü  Ej‰B!•
Ê-.åÞž÷7Ñ ÆÛ÷ÝwÏ^Ôàcé`7% e ÑI Éòø}

  `#¢VqÓ\ñwÁˆV®¡«¢_ÌhÊÏ”S×ÒfÛ]2  JYF=@§3⁄4 QÒ¢Òe§#k•†&ËeÑÌ3ÍÒ i €m ¥É‹Ñ†úJqÖÚ  ́¬§à3“ýo{ 2ÜF–-Š‚9Æ/ÔÄ 1 @ 
ÁF
ØH Åˆ`¦$ò TDÆ • 'à$= À!8 ’!ñØ±2 Ö  wPÏì1⁄2IÙ›<3a;*«Q îμú‘ó%μoÝo;HF—yÎ Fˆ Ü÷^»[{íμWË; 8 ,iÄ ̃ É 'Í2  › b1¥Â ]Kà ÔvjÕ>Nf3 ̈ N“A$\ Ëe; Þ  μœÃ„ƒÀy «ÝÄ_áYâ÷(o„ÚöÃ> °Ÿ]BÿxÊ1⁄4ß:te3ïLòŠ  B m¡ ̄ NÑÿû€£6 G£÷ˆ. ž-ëýûAÔ<k Qÿ,ê ́ÛÍ¥'ÍÅ *Nï°a.PO7μbÅÍiýžuútŽÓw ðÈéà÷ãÃ μ–£  ƒ ̃h —G¢ +uýÍæÿ¡L Þ,9ò {ÃY hÇ10l  e P2†ñ!©xS3⁄4& yÀCAÐ1⁄4¡MH`ÀêJÛÌX à± ̈B¢TM3⁄49kafmAq€~  Ÿý° I'©’ ÊÃ, „L ®GÂ  a%sügËoÜÔLa0;TíbïéÞ sø    Fh4mÚ¶”Å„?
ß3⁄4r õ(0  ®V¬JpY Ùî(+© û>îG ° JôD  3⁄4ûæ SŽ2o  ̃7”tŠ" 5•3⁄4 ;o0ÅS/C“ž ÑZ.$“p  ,„ä‘¤h†N . X„ƒ,ÉL›Á>)uLœÆ`€ ,šåb1tîIú @ þ?Ÿÿ§2rý
]@oòÿ\yˆþŸ«ËíG‹ WÛmôÿ|øð ÿï €þ ð È ÔÂ“?”ÿ¿šòŸ  ́/gÆ&5×/“ËZ‚’¬€g ëÖýfïÕÎ‹Ý ” ÄWlEwól|6 Žûñ¤2æÖÚ óüåîv÷ ̄;ß b->a*¢â ̄(%v...gg v óó×èŠ¬¶$"t?ú  ’12‡ «ì óØT ̧Îë4 ́}°ûúëyí¿ÕOÞ  ́úÖTa{oßå ́{ ̧3ýæ`§ûbï»×/ ÷¶^PÛ e† F1⁄2Ù$Rìyj[$TDgÞíQ„§.Ìk Øí fV]lßÃça1⁄2 õ`ñÑâ"›Ì¡!¶õjÍ7ÖGv ažÄ#iI3⁄4y SUˆxBSA8Kö  „·Õ  Um  Å óÁ
Õ  jyü¦ ̃Ž#¬ÚZîÛË ›ÿañ“ûÆïù  u ̧‹;\ ã‘ |ÃXL81jaÐš¢Ï   Äqr «ÚZž{ Eô› sV“GÒw6—/” ¡õ&‹` ̧ :  ‹Üg*ˆ;nj¬ åkž¥qö±®ÅZ6 |3(·È‰ \ ¢!1⁄2 ÷§æ§v}éo  12ïßP]èÖ Kü×“!¶o51×§ ï+HÂ  ́ æ§Œ  μ ®çˆÂa šâT,- 43!Çé
‡X8Þ
Ú I  óμR× å1⁄4„ Ý(ppñ£·ëò(ëÁPõ_ 7 Ö|þ 6Nfñ ÿ Ñ¿v, ã IFŽÈTí 54ì ̄M±®oéG— G Áë|
¡© ÷Þ8S4Ä †F2@ ®EÓ? Eé ́ üUšöFyË ê>E7ÔõFum“Ê8íR¤X¡—|1⁄4â ÐMF=_Ù¤(¦UO» ÏNot ß°ÏEn3‡âküÈ^æS  >û”Ù$¤ ·g
Mýae%‚C   6Œé ÅÚuÓ+% /»teATt ÙCTMìVícèÝ@¶V†®dë ¿9  æ9!q ê Ý7Ÿ§ó„ßxè,Ô Ûh" eq§ - 1⁄2+ÒJÅñß2©Tv ñTïR„ œhKþæ5@ò¿
õÒm@á å«PG3ùÁ•1®m£¡N œ?oNÑŸÚfÏc î   ̄'üƒndióÏí Ö~ S}ÿ> HôPúß«î ×ú/—[£þs ̧ ÀÃ÷–TŽ‰ÂS  «1 ̃Y ö›0†÷2Œ9“ÖQ£)ôÏ]Øyý2šë>ß:ÜéJ ì®PùÃîî«ý1⁄2ƒ£    ö »A£(çãã¥ À!\6 ̃ 7(ì&Ùc¤(ËD– :,£€ ‘§âŠá  +i†wðYŽ¢yo$ËeÔ¶dÈÒ¥a ÿá 3⁄4 „)U=c•Fc@1⁄4~ã  ́ lm[xnyÇN1ùï  áMàð¢v    án»îμüÕÈÒ¿¥âÄuÑI O ̄8š ± ́Æl¤©rSŒ€. TMƒc  Ùž  –
ì â xšÌà€ •«ô“^ëÅÎÑÖîËÃŠ’Ê}=š!x:’›%3á_ ˆRÔÞ Dø 83⁄4’8¡€ƒ ̧ ìŠ ŸÈ÷]G3⁄40< –- 
ý¡LK4@y w ÝZ=5[sCi ¤Z^B
ÑÂ  ÷öë×oö¿î ¿ 3⁄4Ýz1ûâp÷ë úv«ñ ©‘jðTM>4œ?úqÍ+û«|ÎaeÔäæeÉÈU/; {1⁄2w ́u ́»÷oK&ã ̃ñ' ̄ μ1⁄4&üÉ‚—úc 0á“*y  ýÃ]{ ¢ Dñ$< `àh ìBeFWTÂT~Áx^ÀQV8 ¿3Íœ 91⁄2 ÛUTcýŒ®>ßÊbTA 1⁄23⁄4h[M1⁄2áÙð IFùçÌY x- ø7ašß m÷2h DÕ...6‰ôásï<ŒG?«W1⁄4„¿ ̈K¡"]z¢„¢Y3—7irDš ̈&BŸêÁ¢ ±XsÚF5yù  ̧>ra":Ž¡byÍ  1‚•û)ê
«!þ ̧Š(— oo ß Uòä–ã oÚÁ3¡VÖÎ ̄dœ
û>ÃÊf ilVËß âKÍμOö® Ì æ t†_Ë gØšrXaq  €b»snBN  «ãJ"Y "frÈ2—ì"£Hir ́~ÖÓû $‹“IÔSa ” “·‰P‘oÂÀä ¢`ãYÒTPmÙSÅ·jP± oD 7î ÉW  0hãä[±Ï_ŠòWjVô\T Àšñ  R( týa#úr- ̈ ÞRo‡ åC1⁄2 o  ̧ÙNCÙhÑå    ôÔïc1V 1ã?› Ë– ÿcü?  >\Âø¿íå•ÅGË Hÿ3  ́òðá úŸß_ÿ£μ  ÿO ! ø þ * 1‚ v(ë N9Z =Ûù ^k ^  ̧ ̈r€GŠ1⁄4E·l:CTMÞÁùt  0g F S'v4Œ§êYÔ— §¢-2îû []ù·fÓ oa=î Q¿ we÷p‹Ya(®zYóU%Û{/÷ o ;/\?ÐåöZ^1ïw^3⁄4ÜûÎ.·ì•{ > ‰ "P^,3⁄4}}
Õü ^ ¿‹/÷3⁄4öàÀμY`5D“Ð„G ^‚ øØ%;žûÁ7ÑcYbò 4lÒþ`P¤É... bh¶UFRg D IýÄ“ê$ ô !  1⁄2 Ûä0=så Jì‰/PQdÉ
 ́¡ Åí‰òæNl&± r :öˆÀë OaK PBUyÛ^#ŸH   †ô k6 r‹kCåB’ í@k×>‡ö d2Rv côýÄÆœG ¤Úî3⁄4:Ä ŸTaR ×1÷xè×  Qÿ& T
8ÓZ5 ̃©çS ¥1⁄2t#X,U •ñ8  ̃öç €±T¥îŽ”7u¶& âv%AY7  & ̈ý @TéV _c `Ì' hÿ< 2`" B... Ú =# %  ç° î {€ôGQï|„TMV ́1ì4
‡XöGŒ2  = ’ï9+[8ÕiÎ¤-[aJ! “ Izˆ3 r»
0’!ìoC ó@lƒ q ”
M¦zé±Eé Ôu89Î¦  jÁÛTTM]aTMFb°OK  ́ F X H  ü†Ë íÏ~ˆ2÷a‚Ï®"Œ@μpÁÏ®øOœöSŽÄEjTŒPiËŸäÐ #mä=ë*v'TabRÍ%.NøØi8 wq NŒœÅ•~ã‹Å%þ à ̄Žþ |
±’ o¿èÃEî‹Õ ́†Ñt+d  Ö÷Éâ"  ¿ ̃¡a Ó,ðŒ`wáÏBÝ›bé Š›ÄäôÚêíZæ¢ã J× Ú{‡   VîÅ@ŒØs‹z8“{š2$ ¿õ  Õ@rO_ "}ñ  ËÁ'ïUF  ¤Q—æÓH—ÅðT Z9ÕPRÉμàN ŽQ'my  å8ëÎ†aŠ  ̧èouqñÑ##Ø=ˆ ä3 ç @? '} Š TMœ rÓoZ ÐÒ  ‹K ¿1ž  Q%Ä Q‡Ôol  •œ féyμoÃ  ́:]›;äÔVÔ“F—BÅ¢å/  aao@"ß>y—1?ŸÌo ^P  N@Ž 04[š‚ I”¥
 LôÆÖÀë PMÅÖ$3 ~èÜ3sÖÊV , »Òå Í rýc‹ýÜB] ±&CU÷1⁄2Ôs ̈>Û®:F T–ò” uò  ̧Wvà  íÔ' ‹âyÛ‹ ÕÅhÉŒDô@×ÐN Øg(Hîƒç€a  ̃óž|a£)†ÇjoM1⁄4N.ðÄa Z ÿ{– + Ôá\ä= 2 

 çÊéi μ~L Ó¦ßK“ ”ú‡È(Üþ >Ñμ¿gPî7“)ÍNÙ |\– ̃  KçLæ?
@ÂÀ·»WW‡ÿòò731⁄2Áþ31⁄2òÈ·ÿ\Zjÿ ÿé pÿ'<È»þ+  þ ̧þÿ6áŸn  ́çÄ 9Êùúâ<" 71⁄4J?  Ê§EE1aû*èÌ«p ‡/ž+Å4ùÚÅiwˆ û'¶3]ž{=K  ptÿÐNåÿ  ? ý μ‰dOV«>íˆ [íéužμ úÚ`îOJ‚)Q*òÃÚ,:®áý“nÜ FSôÏ ̃¤v—áMa ̄3ƒuËçv°2 „1‡Â ̈H-Ô §Ó+”+÷ù...Li% ¿ï  \    ̧•þû «X^Ô8ÒaxÙ
10
0 ¦ ̄®|À‰ €F4']Š4âE ̈í ?2W   ë%&p ‘í¬ NÏáfFq!T ž 1—* 8ó“«    •ë
ðpÑ%pÔ ̈þùøø‘ÛH t mðX tè¤μJ±‚{[ö–ÔN œ   ́À Z X  ± NtÃ W› šjj3⁄4À1ë%Ã“Ä5‘    `G] ‘MhÀ †‹óø‘e*¡£Ðœè×ÍÅŠ› ~kÐí1 a<Þ{ ô;óQmÞ; êÉüQÁ¦\-nüFàOn þðç oß {ù Àn/ ß 1⁄2Ý3⁄4qQ,þ1⁄4ŠQ_)2 JE>   ö‰Ô`å:XÇ0o¡ýD[æJÄ ÔÓu×2 H€lâ[ ̈I ±Þ3O aV þ“" ×Áμ 2 Ê yå 5 =μ
 Üyo$8†Ö$éGr¤Ì#8»§ÁÞ!Ú¥¢í|L!jàpÆ* Úúô"E
ZDCñ$XE·i 4ál0U a  ¶‹8 ú‚‡àjsμ ¿ "<Ø"X ÀÃ-y@ä Ž;1⁄40 ̈3⁄4 C8n/
] §] ́
 váê‘G 4 ¿ÍvaÐ PÑGY ́‘EÅ·ívÞ{^ƒŸ1⁄2ß¬Ö ÿC[ 8·õ•Ç763⁄4ü   2·ñ'¿íÈ— ÿ¡ ¿ ́ô‹› x«#F — ßwOàÉú[m‰'íß2íù âñâü¶Wï~:þj›qõ o æÎú;ßÀtû<I$ZƒŽÿF  ƒ†rV u ”I,šNËÈ/J8–x¤Ž ̃C±ñ& !<€áV ' sš ÕŒ-„&!Ý20 .Þ3á »@ÙçUÓ ø ,éáÃå G? 9Q žO»ˆz¢ ̧ 7Â¿0 F<NÅ‰GàTNa:Å... Û< ¿— ðí...  ‰œSòÓ‚f' ~Â ®ÃY ̧w6u  û¤Ã±y
ó¶žs£IÒ›®7&oBñ‐
iî]ÉHJ‡äiVÌ UoÝA«o<dÓÈ$êTMˆ Œ œE £þ`ø L ÒcÌŽGSŽëHfÑ§ q ðf‚7©äôTì¤aöÇÀ ̧¤h1ek•`•¦W8%uó% Ö±.øùÐxëM'f«Õ'μ¶¿0¬é¡$ Ž8Àb ×  ̃«‘õVTM TM  ́,PíÙàp›a— kyŽHVk›Ù< ~kto1⁄4EcáeÞÝýS ò1⁄4ÓF$Èõ@®  ¤ÿ\  úã÷g
 ́&ý ó??zô ̈8ÿ;|n ̄,>l?Z~ ́ô ãÿ/?\ZúS° Ž§
Øž¿iÿþ'—ÿbÄÂÖoÜ ÿêê ëß^Y}ô°1⁄2üh Ö qyåÑŸ‚Õ?äÿ¿Ïúc2š Tü ¥å•¥Å%oýÛ —ÿÐÿü.?÷ƒ ñ° LÓ  `té÷ üŠ¦ ’R TM„Ekst ÷ƒç‡G [ÛG `+H‡!¦DNc  ‹õ; jμ›m  ́ ŠFÓ [Ñ}»sp ̧»÷ ÏðÅæâãE+ B 3⁄4'  Ö o‡“ñ ýîtè]õY m ̈J÷ÇI? Ø PÆ£è‚ ðSâ (1V&)V %D0 ̃ TD#£cj‰.h c vL  M% ›•Ã)!=Q3 Ø‘Á  lÝ`Ö : Ø äμ:ƒ8 ò÷/ƒíu ̃âÑt3ø÷ û ̄0o0§“ =‘ ̈ÐAU d ;Œ Ì6°Ý–šμJ ìža±:à¢Q { Ñ ÈT ̄w bÒI”É‘ÐŸ ç ́ §
  ! ÂMõ·—$ïã ̈ûc8‘N X¬ L,ð¬/×yr¶©Ø_T)T À"~  ØNo—2Õ © Ä<ŒÕ
0Š~ “Ôÿo1⁄2ó(ìGŒ 95ý‘aH TÍ$ ÈÆà°Ð%5P)A  ÆãÁ ‡›ý0ƒ›¢  L%àæÒÇ„s íˆŒ_Ðämw?  7¤Ñ H ‰©û>ŠÆp‘ˆ?F\ñ;QÔQC31¿ÂØÉ a 1ÃY fWTM–¦á0Ró’öÎ# ́ ;OÐ¬ Ý ̃`‚j.B  ́k¦q1⁄4 MÐ± àró ̄ÂËx8 ê°á .—ß§ \w\p«  ̧4þ)rAé¤nø
‘ëä
q1⁄2ÊáõÏ£ ùYÌRÎó z%5 •< ð  Æ¢aaë à‹1⁄4‚ŸÂ4MÎ”  ˆ®ãbDBÑF z «Ož ̈„Ð ̈oμð ÷|w<I. ̄x è\ 3  ôL‚›á q]pþ ouÑø©f %ÏÛëäœl`_3pö ®1‐
§wnþð í§ó; ×4ìñ h·Û J_žÀÔÓø Ï ̈'zÙL‡òz‚¶+sû1JìYx
¢NÆ@y‚àÕLÑË_„ q2l¤ Ü‚C4K 2   \ '“ð ãBG“ hRÓîμ!“ÔyÕ7î»Õi ́)‚û9÷ù€ 4 ‡ˆôi ÓÒw'äáb ñ ˆmÒ{ ± []5H =UÒÉ` 3⁄4G OF ‚G
> gÙ Ö~3H®€Ò†€  =`á1⁄2 ̧   3⁄4T¤ð$I0ˆ O2 ¬ ̧G ÿ. q’è LŸ ¦^üh‚aw,O 4R ̃Í m"fÍÄi8H#k6 `7   åPg~ÿ¥  \LÉíHö TMR ‘
¤ ¶d2D?œtvz _b,H¢ çÚGî$
à|ÙÝët iŽá/ŒÒ:_á,
%åQk8ƒ ÃxGÌ D—1  ÄvŠÇ¡ ê¦U  Ú$Ê5B÷°AÜ‹§Ð? 2ÑÜ¤aj_Õ= C ̄œ= ‹Ã@Ç“è# zp“ÕrGbˆpeÉð Q=5qk£ÑÇx’Œ† ÙÒto‡ < ý ¡»B‘è2êÍl3;’fÒ1?N£Y?
iÐÎ¶  §  † †ä *I áEyw ,Â  » Ë^DëQnÒ ˆ6Ú8 Ó8 ô•¿aFP3`ÛËnŠ1Ÿ$ ùe6 .+ò MÜÑC  ́s A,2\c 1⁄4¤Ô2A ̧zkÇ1 ́ñ8gx’„ ÃLÄ#±\Ì;Dù Âð¬ ` ãÈ| GBi,> - ‡IŸC„¢9oB1J<,îŸ* Õî 
ÎFL  3⁄4Ï »\è Ì  ÞÊýI  WŸ;ˆ¶ñ”‹(·Ž 3  ahw k  ÝÁ§¬CÕ ̄2\kj/Æa ÁæjaNâÃ7ûè‡Ä(? L`ü $Ô¥.ÌŸ9»ÛL›
z ð“<bžTM÷k¥ç;_ï3⁄4 yžõ‚]ŽLì+Ín  §  ̃
 X[/0ø¤ 8<]`3J bsäPTG‚®j
/0ƒWÚ   ¥i– ê&ïU8®5ÉzÓ¦,7· On¿ì–F‰\3⁄40 ÝiZÑOÕ5, ̈ÌF 19dƒ£5'ê›ÂÛ êÌ·-Sýò“.u IÉL Õ
`L ÅÎS8ÑsÔEdP!ù&Ð 1⁄4±ù‰2×rî†{ fÚìvQuÑ}Û~G ÇRÍ1⁄4^Ëm%[Ž %%Sü:ó¤3· ;° N _•” N£o F Œ B ÝìVUTM® fI±8 ́DÅ¡“NgaÚ#‚ ÁTMàO „ XhÕ`¦åIS êò÷Ž1⁄4ÈË]å ́©•5Š¡±“ÆñXäM&W
— N   T‘ÐôôÙõ$W   2ÑBœ× M RÕ TMŸêÁë† $^×ÍZÑÅ3 ÷þÉYšQ+! L b [Y  öòaQPa1S®Œfá2TMŒ§þƒ ð‰  Š!U ÅRT ZÃ ̄ Žyz n ÎÃ4 ÐÃÅz@îžô8æè†dÈÇäÆ„c R§†à2Äu'©ù ù-
(ô YTÁ&è `¡â!»†ÂU¥ƒæÉμd‡ö {ñ)9PZ ‘RkcŠ 4þ À...Ó3ž:Á¥ ̧2m...a[V¶äS÷kÇ ‘7š 3! Û î;]áà<u) 0žiV9 ËyöTèÇàð„_ÀÒ03 ãã°çÉÇ ̧ õ× ŸÊžD V q mz —

 iZ¶nˆzßßÓó$3Ï(’»(òj#ð®‡„®ø ãxí ìýí{7·†ë vc;]ÊÞÅ°«AÅé7g¬÷@¬Áè Š { ©ÃÊ©ì  !aâ
 d  œÞß§e‚ËÂ×»ÀÁ^Ñ  Ù2ž 4oS\=`KJI(qμöTMÉ!>ÁejxN  œù*=ƒ&oös ̃ÿrTMw 3⁄4>Øù—7;‡GÝW;Gßì1⁄2°Ž»1⁄4!ÈjÚ ÔrzMÌTM1Ü .š ̈Üe¶ >k...  TMe¶‡Ô...k§” ¤Z×&4Õm°Áj( %ÒÛàD:g¬n kÊÓ1⁄49?1⁄4Ã¤ß¶ ÙÙNó§;ýyó þŒ Oógü {jŽ01⁄4 or ŸRâÞJg1⁄2sño¤ó¬ÊéÃ¤5} ôQn...ƒƒï+1ëd
 qo~AdÛÞrÂÁ uœ~Y‡ z ÀwpÜ1⁄4}W |ÆQsYÿŒ áóx6ý<†ëíç1 ÑùÌsèk@ô5}ƒμ! M ̈Ï±vÖnU¬   ! ÷  j`§lÈú® wQ–ÞÓ :Å ”ÈîqÚs8*ð”Ú^ 
Xmj±ø pH#© wc€Å@Q29D ̄óóð#¦ÿLÃSKÍ‘ QÚ Ç Ë8b kà €lŠ }  ̄¡Ø ¥"JÉ  áL/8¬TMo 2Ì ®Ú1⁄2I<VÖ:¶4$+å WÙM‘žxåμ`:TMé R¶Ä&Nƒ¥¿ý-{©V  p ]
bT...Ûf   \†}  7 Â
Ù_&Z  (}è
Jm 3ž 5ïÎ Á| ëëåov vÊkN| z    é“cÃV= 6òXÐjA1ãÇÏ,Ã6ø ll KHßaòe /D ̧e1ŽÉòg‚•Ât°Ú°ú¡õ Ýç;P ̃ñR÷§ hS ÞbÍƒ  ̄ÞÕZ ‚õxTÎ $?– a ¡bÍVÅ  vôÓμö ÂTMÉìY\
tî Þ1⁄4=uQÙ} ø1‹ • ¶_qÅì ¶” ZLŠÂD’»m ̄ïï  mjŽ ‘>% ¢äëkQ¤N@x"\¥Èá°EÎ¡...r^’Ë{ÄYÜêx_ã.&åOHê> 26Ð°n ¶
CÜ^G  \fZ— ‹‹‹ ¶Ò€!ÊîÝ 1⁄2 6Ëžxšî+ÃÒ1⁄2`I{2é3·ÔXy ®QJ&»> Ã«ˆÞxJ ‡ä,! édÄqˆa2xzˆ ̧Á”
“ ̄w 1⁄2D ÓOz3d1⁄4ùv&tN  FG+ØÕ£SzO*Ù ¦a<ÐTM{ ̈  NŸæü:Ä‘á)  üŠÔ‘ &û Î<nÀsF O $+àJs  f|6J&Švÿ  —¢§ ̈-–#:á=ÇÛmÁ 3 ‡ è Ð þ ̧¢HÚ](Zf§ AÃ ̈”@Ï
(›¦÷JÚÈyP1⁄2€ ́Õ Ž+N ̈‹=']É Ÿ ̈wÈ‘qåk&v  )/¡Ø  èË9 2y>Åäy sîÎ áERTQÓëJŽ3⁄4 H®)1B Ã·f÷T•V©æVÔ33TM#ÎüB
1ÏòÝBc6p¿‘b o ^+¡ ̄ ~pŠ ›  .§ ŠÖih¿©Ê· U  C6
/¬.fb ̃” TÒ3vÆD¶ ã
TM2×¶3⁄4Ê>L3⁄4Þ±Î ÅØ! ¢s HTênÐ“¤ ¥Î J...C ‰ŸP ́TMYÁŸOè d.+Hg‰j:   ̈Ï1’  «¡%B"¶>Ð„¢á»§ W¢4j ·¦mÚa •J" C ! «Q”
ŠâL Á÷ÉŒA áåTuWH]ãS:Œ¦s›Âp $ÕŒ•þf  - .Ø[zs“ˆëoDI  Q ̃y%– W‚êl¤ôl5» öJ\Àq¬•q¡$z K Ý#Y  ”-0Äû•aLÂ) ÓÛë/ÃtaçMÍXÝ ́”Y KÃ £å y ̈ ë   ŠÇ«üÃBÒ‚     Þ?)¬ƒ¢z»“¢øœ j@‡ ‡¤)>! ˆ"ØRQ Cü 9Ù£äW<Nnw¤ ̧
  Ü
"+ Á(<1⁄4»  œð@  ˆ“ ̃g" ùM|aÄ§
...‘ òå ̈\S`1%T!± "K•[p¢ S’Žh8–HCÜ¡&’©ê úU]úòËåvÍD aCÈ ̄z£é€Á¤W)...RR‰g5 ́:—êtöoÛ ;[GÕÚgý`çoÛ/ íïß ì1⁄2~ù}U3  .}h‘ÕA'0 ¬9Û‰Î*yÅûÅ ƒxT“μ ƒ;  Z2ì“ 71$Kμ'  ã®2 ÓÊG HŒ‚ˆQ êkÛ1Æœ| 
ÃÇ æ xw1©Zó ,3Øp†¡L8\6V!Ã ‚ › –n>TÍ “Ž2k1hí ôÏö a  a {Ã ̈B‡INOìm: röZÝ!ƒ»h‹ ̈±7 û jú›Caõ 3'Û ̧= Ö2ûwF• ̧nÝü5  ̄|m^î  ́Ñf2_ÐÑÁb:87**’ &°2sázÂ«êYžJ0æf¦J¡Ö Wdäoá2ž[§è nØ¥  ã) CN\[   ãTMBóÊ7;[/ð/3É ®2ÿ ßEÓ^3¦îŠúÂ}wÖ‰ ÞVŠÆ¥Ÿ ̄¿Þ;ÚÙì  ̄Ä4›
âmùùz/„ÅL# ̧ OÙô'b–PÛˆK^^IÏÆ_$ ;ŽÂã¬ŸEÓM69EC  I 4A¥p3ÄlÊeõåúËÝW»œ|á ®« ê<1`»RâÓ£”  tYÙ« t  œ,‹μ(£át U8 À ”)¥ÜO!q Wš)š¡ï) Äça ÷  
F8Y @ˆ  Ù’ÐçêVÞ  (¦‘Ò 2Á •Pƒ{ i„†E·ÂμtòLâ3ä2"q‘¶  ̃†nDiN€»B«äg  ̈ÙK†Šƒ·2=ùó¡¬ÁLð& ¿d2†ÚÀó„ 
¤0 qCPïn ÿ19 }±2hõUwhÎ {D%h@~ MÅ  Ñƒ å•ÍýÛXò+ TMÜhùo[¬› šÎÈÌ!±·L×ÕUC_#TWô•EË   ÐPÝ â4ÇF–1^}=aÌ• –ÚzŒ.(Ôa Kì 7'7 ‚ÌÄ% t· Œ_Â¶ ̄” Ý5Èwœ è  TM À... A8±‡ òu‘n‰úFÂärï€l„û‘ ¡ EF°jŒ Z ¶ àbˆTˆ Çä„  Á·Ì„' ̃÷j¢1–L·ÝNä·}ŠZ^á ̧1q1⁄4ÛŠÌ ê xØ lÑF 61⁄4'*C Ñ;Ÿ Þ#¶ ÷ ̃B»
%  ́ìq NëçôY ÑRk© #4Ðhö€,EñGÇ‡d E  ̄á=@‘   œ,5 T2`£VQ õð >pÌÑ9è£g J<±œ  ¶£ 6ê^ìREÑÝÅ%Ô g KN¢ ̄÷Wö ‘Þ“ÒjÓ›ô!fE¢Ëé$ Z“Ò y`Õ ̈yÖäØÙg b3⁄4 s —|8\
{ñ¤7 2gMŠ^>S• ‹Oñ0μ6bL¦Ü¡Ú((r/^IY Þõ0ÝÄ‰ê#žïpIšwÅ ßSÃ1⁄4Õy^3ò‚oä¦EpÈ8ƒ.ËÚô„ R1<“ë ÍÕÁ WÛÁÒÃöC¤e2Ï ` §€± áÆ1íŠˆATSZo¡)*/ € ¡xBj· AŠ  ãT!yBê ¤‡ÔÆ ò Äçc{ ̧“(Î5úÝ bìm s`Ñ.nœ{î®A ÷z1ñ +aC ¦–Õu %
¢iRH'œ.i †ã©3® b t.Á|1Ù„ (o< á vy·yãÒ  ü:aÿ2o›‰’...©çƒht6=ßty Äg... 1í{äÊôB‰ o ̃U ù4   l '8ñ   îCÑ)f 9¦ Ü IO£á‡2dÇÔ 1⁄2 ˆ fÄc ^Ò ‘×H ¤ÖüÄ£ ŒéŒŒ” u}_õD13Pμr‚ñù¢Ar L#‘!Ž1'=£@êñOÊã ìÙš 5  Fýë ón3⁄4Z)  ÙMŠÃäéÁ 9oC ;›μ ) DÕê+ãFTMÃä8*"^ ç ¤ù¢‹
 ¢...

 é  -ÖÃ<¤7ñZZ†é :ÏÅ3Fœb  ̃öŠ!  !  Ì ÷ /B(ËÌ:ã` p3óÀ#•#a«•‰î 9PrZp ‰•ŠÍo`0þ‹ˆ × Bu¤  ç1žÇ Ã1ž* ̃äiˆ€ Þ .øö F>  H@ÉÐ¬é <p †s$·3ß•${ö IK  %9 4f Ï'¡NûÈÁ& 4÷&žð(ÃœiÄÙõv NÿD ̧#n  Òb‐ H.Í ‹fsØjdLû ÐfÃ(g{Ûk §öÆvÈäíY  ”œŸ$sÇ{!†Ê
 ́ŸÉeZμ5BÑ6Yý[ ¡ › O Q£É jædžDc åõëÖ1⁄2A :1&@w, ‡¢ ́‰ŠÓ'4‘Ù 9m1⁄4=Mp ÏÄiÒK`34 \Z3ô £ ¡)=‹AeU© ̃×Dã.$Ž"?X Ä§ e 6VŠ ìæíÚ¶f ýgs©2›? ˆÆÍVeõC ‹-
ˆ Øû7Hz1⁄2Ùd¢”Nñ” ÖCÌ¥NÑ*¡ƒmAu‹ î È‡  &q ãœgÊUÌ%5u üóLd=oVŸ<©k‹μ3MùÛ; i§ /` 
Ç ëk%—1⁄2í;Ó‚+~€ ®`ÿÍQðbçåÎÑN°·Oòœ# ì ́$`€"œY]‹+~ûMμ- J2Á†μõ`3⁄4±‘2 " Jp  ̈;9  i2d TMÜ¬cíö×U×P•¡AxæàPHùãf»1 ó8ê‡¬{ ·8 3ÀÒ¢/À$A6žýT32tã3T  ƒfÓ÷÷°„œd öI‹„ „ 2Û–pTMÎ%±Á\xF^.  >Iu×M Ë<S‘§ŸŠÿ' óûŸßŒt2¿hÔÿŒ> ä G8WË ÄâpIHûÌμÍ†›Á  °pœÒùhov
Ã5â+ ®Î  Æ}X,WhNH  ŒÁ®+...š-1⁄2Îf ...—šp  Ä3”èZ/¡% Ý–} (üöÝu^ÞshÁ o[ãNLÐU¦àx1Š § MVyÁÎFj£ 'óŸ  ́G ®¿óR§ Þ >|ò¢ aü»èhóÄ‹ô)î©dW‘õO   Dw0ïðl8 ̧5¤a-Žê=Çêƒo6d÷Á 3-{ƒÂú /_ð4 ̈š3„Ü‹ŠP¡ t‚j- °ÌX®ó<ÀŠõ YÃ _âJN1©Qjä ̃Ò°ÅSp [â2Hjmi,2§WO¥ r¡m"L60†Óyö‡s μ #!ƒ”|+BÙ rÿÀ«... ±å3|gLd #`QœÓ›£ ̄  •:„j+5
ê8 ^/?yüPœ •ø4Õ¶#1ÂÙ÷–NAqm"_BA\bI~μt+ÏæqŽ‘d®‘£?Í|2+ èiŽg’ð}aƒb yr5Ï rÊü g ̧hì&2X–s®“ WÖÀnIŸÞTà ¶t98-ötþ‰]Õp-  ÛÖ}Ìî y-— u,iÞN”¬7 c]Ó1⁄2gz#æuáið ? ê Ïèƒ°6Ré  ̃  ̃TMÅù=2Èl ́‚ÈH¢1⁄4ÑD‘!ËW ̄oôÌ2'¬ê– =«‘ŒM oEô¢a  ̄£ÿâ’¥ÁÎv’6%õOôa$Ú*×  kåI¤ kk9Ç4£e » +•Óóøt èÎ {Šx ÇK c ̈ Û£xî- dG7ƒ•æÙa ?&ñ ̈ZÞ(k ̧ÂI §×ešQ]À W 3g 9Á...Ô3Ì? Ìj.JâÙÂíÓÑA kÕ÷ “Ã^8BÏRÿLHÞ›„ŸN\- )o  U(Œ òÎ ̄jw,+{Ó)&ÂA Å   ù=‰ Etôc  Ðÿ hÝwxa ‘ Ñ8rå”ð xÇ“û
&ô6 >U ̧2 ò“ÂZ1⁄2–x#QxÅ¡ 2‘HDÃá7:’ö”÷K ;Í  Øuw“n1h>Çr û] ‐
e6μ,\’1⁄4 ̧a è2*càä ÁöV ,5Í|8  ̈îìÄÂ\Në–lî$+ “iÎ‚CH(jËÂaõ Cb“ða„n3⁄4bb ƒø×  ́ˆZ¤|  9qDrWÒ8*ÿs‡cŽ
A–1 ¶è NxÆl% Èm×ƒJÅÄ›~ ©Þ1⁄2õ à^μDH‚“ÏVPÝÞôR §KÆ-óÙîëml þðv 'c~ˆ  ̃ð÷m£ýŽ¶eÓØ ̄ O _a”¥—×...5ÿAcSâÀU±s5Ç~ ¢Q,:L; ±ÑÍ àÃ‡VîèÔ‘¤3μÐxÙ¿QöØñ ̈å9ãÑdYû A=¡Š ̄ö^ìt·Þ íu vŽ 3⁄4Ÿ3P«úšýÅ à“; 0Ó£Ÿ58Š £) í2Þd8g’li€Îo3” ÐáÞ3μH%ûÌQØ ü‰ñËô1⁄2úå±μÅ ̄?y á: ̈eÍ1)t‚Cc; oè!Ç;t ";° ‰åÞi7ê^Yìˆ V «ó¦1⁄4uFi_K%-8— uápîw··8 " {2wb  1⁄2E./<+ œ†h ÄÜÔÓÀÛí „›sÒ±jY  ̈¶Å j¤Íi¤Š9Ç –Á°Û ¢ ̄ ̈lÎÙ ÚQ€èbB:k 3' ë6Æ ̃K)þ ü ̧2 rB&‰]õ8c3TLà9  aEí HÌ  ̈[EHy... GuK‹'a°aäX«»©‡X»Íy mV¢¶± ̃œ*Z
ècÏoE›—%Óh3ãÞ Ã 2...“h ‡xÔ(e<z+Äi u1⁄2Ž’g 
 ñ—åž /.‚%8VÑ¬M›1⁄43Ä¬àÜQ=œ{ò ̧îØ 
'' Y& Š...I1ylï7~μŸû¥û ̈ãûˆ2G mó× OBß l  ́ ( ròp ̃V“4ƒ)3f2XY®—j*,¬ €GÂsð ̈J&Â5¢ ¢øI®lXJE[’x:R†2ÅôS§sý©q}f,‹ ̧ñ ýCŽ! ÛoÐ  μT 2®2v ×±ÿíÕuj› !?K~m••Xg61Â? áô1⁄4K" ¬9›ž×,3^öø  ̈Êc»dâõ 8 ÂDÖu$Èô ¦ ƒ1⁄4ý8B;å7#9J#öÏ–  ©Z1öÉ×%Û TMFîDßáý,¢DTM “r—
ÁÊ[ o~K Y‹!i>Lfèdb1⁄2£Irêu©1⁄4«.ð' ̃- [?Ic (†ÚéÀ9„ :T3⁄4l‰âà  XMTM...(ù I*ñÉ‹oƒ3C sCKþð+3 Ø¢fW·(A^ ßVDíÇ¶'°'šzI+ÛÀŽU ë¤›!–
vØ)Õ þmlò¡VóØ¡ï ̃bŠ 3⁄4 Â\ÝdÎ#MDkÆ xÆyW¤` Ù h› w5 Ló  FŒ¶,9  C ^‹í6ˆ w ñËw Y •T M JUkÜ r£ÿ•2ü’ v‚‰® ÷J μgKó5š¡Á« u¢  îEœáZŽŸ‹  çÎš'‚  á\¢Àj^og{ P.i~^Õû«~CÇ1⁄4ÈFã †XU± —Ó.@ëöNa 4ò1⁄4ÔTiF ê  ‘Ñ§Ñ É Û ÕÕ;a 9Ot, (?az!]2D-dä T ŽÂ}
2šã.P_¬·kD ̧Ú   ìÌåF®â1éžpä Á 'r•’€ jwIŸg– TJZ\oO ‚lÜSô”1⁄4 % £î  ̄ gQ—     ”«þ ±û'r ã  1ãþþviùÝâJËUtÙš-äμ¤)2f0ä  ̄ 7 p 
Mfulæk SXaK- {ûúÒ;Q“gOåÓàÁ'
Â...ß\¿ 6 ;± R aåMÕžd oÝLŠ è¢ ÎIUμe[8ÎŽaÏ ~âá©w13⁄4iØoózã °–XTMC° Œ2s ̈ØÅ«1 ?æ¶A§H¥Â[‚è WÏ L$œê†K‡rQ  –©ØkyÞ=äè...{6 ‡I Œ h æ’HJìr°K©[ðW †û3T2‚¡]ÄÈ
¢œŒÄl À÷Þ» Ñcó...t jU-d ́§†å ̧y:1⁄4ëoOÔ2Œ1⁄2¦ˆ t×OM  ̧ ̃X»°Ïj<Æ ):M&Ê¦J Ãž±[a ̃KZVž?È9îUÄËZçO ? {«ó(  QÀÝFÂáÄg   ...ŠÅXÏ ñê Î ‡8Á ƒ›Å!nüY§1⁄4óêo 4¤[Å'/.×ž
1⁄2¥ V
÷TÎY‘jÀ qü/ Ýã ... ¥ƒË„¤o.3⁄4 r‰®  ‡ËPüÒ : ¡`yD±: #1⁄4P¬n æâ 7ã£Ô3 ð1T ÂÊy“a! ’©CúÃ  ‡@j÷ÌO ̄ '`šÜÿ`ö” KaL3ÖÒé~d.gw Çæ9p °è9[0 w Û!JÙ°Êd Ï ;öÔÀq~Mñ°óor] ®ÕC‚ÌüÝfú~îìÝ :Ð»” Âõ ̄«qqÜUØØUøØUwi ‰  )C .È›O‹ Ì4 g\ Ópü +ùqú€\tOÐ¡ @ 3loÀ\X| åÞ ̧£ÍnÂ †.7CCvæí ̃1⁄4 ˆö„gn:ƒV w%  slÔàod–Ž‹+ê„4 OÈƒ  «wmý€ƒ1⁄2(AÎô1⁄4ÓjÙË£$ ×^år^ AÍ é  ̄  óâ,_ i†ñõ/“çx¦x–XG€ +TM ï§a rQtäÜ i& ss ÑÂÛ Hâí°©¦ „ ,

 [iv=§ ×^È¤›‘(  ́eß¦ï`9Þâ(Ÿ1⁄2[ÇÆ7;ëØäfëxt]Ë[‚Ây“ëéμN.•ÁÀ»  F• 9f'SÖR›T "idë¿jîž7É— *×f Ÿ 7 Æ+‘ ÖÛ Dy wo”aU¶÷^¿ÞÙ>a ˆ¬ÊÞF ̧îX hS”‹DY®Ù ñ w„G vÖ 9 6~ô#%]{‘ ~ iõ&í ÕÝèŸŠ•3⁄4uý|
ì L1⁄4^ÕÖþ)ä&÷ÉJ q'8E'Xr! ̃ K1⁄2u a   ô ́ ̃NÜ= ́- ÌÉYŒ  :aœ`©« ¿©‹|E ́×  ́ Gþ<ék•ìxŒ1t2ˆÓs AŠ±.Ã «vqþÒóð}ä®  À îb "sP[Ë„l .5OŽ6—Úd k6á!ëlμý1⁄24 ×õLŒ {NFh“/S*  ́? o‡ ́ÐÞÈÄìA;¤O3⁄4 6ƒé ¥‡cô¬Í/ÜE‰°]á} " 7μ2ŸÎÛ[8õ•koÙQ  ö› t (  ÛfÌ6}TA éž— ÑOÌiÕ2 Êe ÖŠ 8 ́Ü Üjj^XÓˆp ̈  ’î1⁄4ìK¦s®‹zû ’{ 9Z¥â&’Œ ́ ¶AŽUûoŽZ O„ Âx—  ×Ü9— æŠñ>íF @"ÂÉÜ× ¬Ä!Â 7[s$ ‚ÅÒè5iõî)3⁄4#óò6èéÛk_»Ö ×ÅáÊ1⁄2æ21⁄263⁄4"v) %ë\üÞ9q¶LO3 dÁ_ñ{ ́éÌ@÷Æß;1ñ”ÊåÀó p -rL oœM2— g,.ÛQ “Þ4š6€hGá°1⁄4v; ̃TMÀ  ́H ‰kPÉIþ"è> Fø3– ÅEÓ1ýY»y®}L(šqÇTÔ15ÎC8‹Ï  ̄©ùíñ }  œ A\m..>®äbÌlzú ̧ÓÁÈ]g“ ãc
 ́:¦TMÌKoƒÎeLk¿Cou × TMxÅ{Úa 74U ÷~m$»- Ps®ÜBsñëwG¬‚
ÌlP` g±î M í]~ w ÖÁK „õCš\ûˆdÓ1LaCð\në>)z/"1(—$XÁ áD|  Ùó*ì£S §a“2iV»âf“qMà¤’‘ TMÂú3–– §Rm4 [ ̧
M  
}1ÓM <Î26#¥ O éÉd¶ ¶ Ç Ã feE·“ 9 ‰Ÿ+!Ê‘ åH†|V6 îü{3 Öt ̧X; ̃á«ÝW;  LUôp¥ ̃í 8ö«ÌÓ[ š ŒN‡ 8°ŸðμJ ×1ùÉÚ\î\© ó ãajAxzÈÜX†Y•¦êp2U¬Ëë= «@¥{ UoK-Ÿûð O ̈äqÙ,[¦ ̄ÙÜn’GýÎîasÃ¶¤r.1⁄4Lú 1yží MÌctÙ‹" 9ÄÓÚl~Ç63@1⁄43å–  þœ ÏA ¤ëd'€ jeì
 ?”ÜÁ*åprší( 
ÃÀj2 ̄ó2(ZŽ> YÂ Ž?.Uqμrî-Ï"WZûa€ YW_Ÿ ÏôçŽ_/‡° QÐ  ] Gx=}æÖò7]N¶0{n$OÛ <örcõgh }5Æp vÊ0‘kQú ¤ ̄ ±oå‹ [Ûú â»¡ w§" +"ŒÈ` ̈L/Y R?ÙçŒ¿ 5 2Õ ̃OR] ‘1  ́ô BdâñæáÊš  ̃È‰¶+$ ˆ\í{öæVs£¶o3⁄4« ”1⁄4F“3Õ Dê\® ,·à‡dž21⁄4ø¶1⁄2ôèñ» ]tT  |óõÎÑg4oYhÕÌ1⁄4£
—  8a&ðÚ)  ̄° Ö ‚¡Þ\g¤Ó 2UÓÄä ́Ç]<ny(ñôNú„  ̧å’——2 ̄íŒQAÎD?
(2"‚ 5®›QÕ
Œˆ-  òFÆÂ ¿m  ‹Þ†o v1žZt ÌL8öb{íb¤ÄTM 3ÍWeh AM¬7È· ýx«úöï ÖÓûï Ô`Þà ~þ2  ðÏfÉ¿xl3μ7E£E=B ö- @«Xñx Œ©(òú=õ@ ÙRW   ̄ù^Ö¬¿]†»ÙÚ ́ ý32 aT, 2Ù Çð4 õa–dà•g•Zpo#h ́ý ́p*væ3,hE›fÐŠég(Àñ/ ÄÈäcÄ ŒÉ&ÑøqöŸ EÄjÆTÖ ̄Üæo iþý(!· ¬ŸœžêÈp% ̄‹ñè4 †1ÆF6¡:•{3 PaO% Œ= 0ç‹uü ýk ¶3⁄4 ̈3⁄4]l<Ùj| 6Nß}Zo®μzç“êytY]h×jèÌ “ÍÖ ̧Ær!muaÇý/kÇ?μZF% ,  ́Q âå ̈íh4PzÉJ–Ûx <^1⁄4©ZZÉ©¶22ì×#3Íμ ÍTUu•†ò” RTM “A ~)×‚yJ?6û ^ TM> {Æ§ xÔÞ l'ƒeÐè~áEò "ùálôùU2ú|4‹>  õ?  Ï> 5‰? †S ̧AcÁWÉ÷Xð/ áèóWÑÉçWáäóÖx   ̄>ÿ *ÿe6ø1⁄45;û|  ?ïõ¦Ÿ_' ?¿ˆzPTMHˆŽ í f=<pâ Q  Þ †ý ‡3D?“...« oƒ  ð iÂ  ‹® /æ0îAJ!ÁO«å/0“ëâR?ø"...¿+}úÒÑ¿‚ ̄_ Yê$¥>€9 ̈S+_®Ô—- [mé * 3PÇžq)îÞƒö“E+{«    Æg¥íà›... #;çh‡¦ò®DG0ôNç%b‚±/   àÔ2TÁêbåyøêè» ̄Þ1⁄2  ?1⁄2{P  À3⁄4øÔ®Ãž
h$5zÂÿ©ÏμŽó'xÓμàÜ,t‹t
>„î®Â¿ ø  ¤JtMæi©ÖZÁIZöõõ7ö Znp  Øç¥úÊõü  ¿_ ¡ fòd: oV}
Úyûw fX©öÔÌõÜþa3⁄4.Ã¿% ̄¿méïÃœ3Z”ý Ã‚„Ñ@ jcP§ƒ;élXÕïÑ ®Ñ¶$ S`Ž ¡ Ûš ÑSY¤... Èà‘NDž  Ú  Þt:;Dÿ¡\ ̄yÚ $ÀÇÅÅEób1TMLÎZG óép°Ò¢èáaoÚB  ÚÄ‡÷Ï íGÍörs Ãtá‘2 V›  N ̧b...ÒÈ4ý—
Ã1⁄2× Îþ>1 ñ ”êRx” ÊjcÓ¢ _Yø[ /)èS¿Øl.®®• ¤î§JP1Þ(?  ÈÁÐ»(ÔÄ”ô“ÖÛ¿o5þ   ,óqã ̧Ùý×w*î” å ̄ ›=NkX.Û!
 ̈”m V(¬e!Ê`„°çÙâ b wÔ{_-¿ù †> ñ—müBÕkÈÍY KÐÿûj © u 92:o ô +žÑñ +¥kÎkÇ ÍéËvA_ ¡é €ÔJ—N áTMíè  5mUíõ©μô . ́ ̄[g®m*Í, 16 ž1Sšμ Å–ÏñîÇ w·Þ î ́hCbÜX  gA\£Ï ! ×âå ¿îL&£ „GùáâíÎîë£ƒ`g w ç  7žÖøþpoû ̄ÝÃ£ƒ Wò^ÞIýÃ1⁄2—],3s  îuÿo33¿õr÷[„ ûc çà%§õ=Ú} ý}wwÿÛ•.æîàh3ÊmÏÊì | 'è I9÷8Žr2è ¤“è<ü sÀ Œg•Œ8 ̄ÓH >I€ TMÀnÚÞßzâë`:uÚ£âC1⁄2Æ ? ¥û¤WÅýMÁÒ‘ å ̈® ò[mô 1v GK %8 /{ i'¡Ó ¬ s*< Ýí—[‡‡"ò£Ô·EãGo¬ŠíÑ3⁄4ûš®?&[å§ Ï§~w Íûn Î ›ËKH(|Èû
n¶A! Ïß|u ̧û_v00Ó§`yéÑÃÇÆI’IƒÜGÂDÓm‹ã$ ̄s  bð ÉóÒ:ž ́ŽáßTMþ>‚ï#ëû 3⁄4OÍw ̧3 _.-6Ž/ 
í1⁄4«μ  ¬  _~Ñ\ú[ }{ûÌkŸ©Ë Ð(T cçŽ(H S>€Ó† Ëké üÛ‚ Ïáß ø·s|1Œ ,? 93⁄4\iÃ‡Ux»oƒÍÂ‡GÛÔ|‹iêW '°»ÕV ûm‡:Öy g' £ 6¶x|1ˆg©ó2öeëRæ ±0+-úÂ—‰  àäõ– åñÉìÔáÖÑ Ê2 òmÇñýC‹ïCñ †® ¡£1⁄4o?\~1⁄4â  ; ,IN¬ WŠ
Èñýb±Aoí H‰èp¤L ëâ a1NÕû kC~cÏ QôgÝ`Ó òçÙÊãμK>û&ÆR óó ƒ ̈þÊ"°ŠT«ähèí2R¬a{9_ÔêõO Þ5 çh P«(M'y  úäÙ»ÚŽ‚uq‡'ƒs/ø“s®ßÒsA¦)s ÌUÛXv„¶ Š5É .qôü ö¡õoÈù•Œ} á[ÝyGþÖ9Ž ̄ùî ÁS/h 1”[ð¶Ø...!àˆtV3è«¤÷Ù ́7¶¶Ú š awÖÁh•Ð›±Ð...£fËƒL–*Á h»b1çV`õŸYÒ!ÉGUμ¦ ̧– •2i ̈axM‚  1⁄4é^%“ý)kz“ï;al]Ü1⁄2 FS„     n î° ì •ÝTÛ{ ;  Y 9cru#TMqa\! <š eG ̃k(#  Ã81 & I ë]%‚6 ßð„rÊ>ŸÌê6”33ýŠ ¡ÅYÙ{...ÒUz  1⁄4WqŸÞ, ̧ §ü ̧{ M»ð1ZËIFê“ ̃âH ·£  JŽƒ  ^R2¥L – àÀ...ôø IRf‹¦;  , ̈t*õ;BTM#+ÖKžsØ0 8a›” Ùjù!9ˆ£ ‰2%

 OÑz$ qH/Ø"p *{Í„39^^ÕQ1⁄2žžÏ¦”dŽ<MÉö /
ˆXO\à0Ïãp<Uw ̃û,ÓtŒ:Ý <2Q Y1⁄2ØH• ÏogÓN“1 èy–:0GÝh‚÷ŸLü&x¬ï~Þöä”
oç! Yä ̧û uH,; táöTÍ{ŽÉê‘ãåŸé  ̄0|¬–rNm‹! ÑM ̧LLN ,o’gtÏ¤êœ^o< ̄ú± 9u:ÛG ë μê2Õ†:u÷1⁄2 raZ3'¦î8Ìé...1⁄4; ÜqQ•®ÜY<±œ¦Ë ŸP ¦m„aÈ %.  ́ùšö 3⁄4†è !÷bSa¢ cÎ!È]É  ÒSNôd÷t© ̧§T ̧
 ù<V _gYa d$–! ÔÏ ±Í3^ãNÕrC• èV¤Ä Ùè_QsB ¥ö=îp÷ëO(  c Ý ̄_Ãt«SPÌ‐ s A %A (åu y¢>&è   aL   ‰W...c€ôÐÊ— iø
 B±l‚HDáô*åQÛû;àTMÃ1×ixžƒ¡1RÊðö8M TD{Fm8G 2Ï  àXw3k ̃kKlï!Z‘ŒÅoYm5;B8†¢å8ObôœM”TM×Ä=h ...9yÆ»Ù‹ ïùJ–μa¡€ãD)œj\£ZËμ Ü
–•ŽF1⁄2õ l3⁄4`3⁄4]e Mof_ë6Š9?/vxÞÕ VX“  Ãž¡ V ̧ý|¢€ÕPG 1⁄43Õ Éãpðn •`,uÊgÌièêoTμø ƒ1⁄2›
-ëƒ2 Û KùôŸ4 ̄ ü   FW¥ ̄ újI?¥a¥^2›a....B“ ”TMM„ïü°„ g  ̈ n Üì!‰ %ö}J1Â8B3¦h  ”ù/IÈ þQ ” w(ˆ> ’è HáàÊ ÒÑÂÂ0
( o HZ à ƒ=„[a4
{ãpD¢ÿ>0fÝ1⁄2 oÇ t ̄õ1Ž.Zƒø  Ë.Ås±9Nú÷·“á0 5   Äý¤w#¥Št  TœTM Šús *~‚b JzT•p1  ̈ZçÈi« úšCwÿÙI   ’/ÿ† ́Í4r qË£m4-8μh›ë“ ̃Œç‘›  í Ù<Ýæ'lŠIL„E1Qdx[NO•¿TMÙ+b9ì%'zÄ –ã€$È‹/ àßÖ»/ üø ?×ZK oÔPÚyh‡-äÑ×`sÃ±ÉÒBÕë‚Cý%N I]çÙ—¦b‘š oèØ¿TMLüR:QÈxå  ÷| }B=÷”úÅtã úð‹éÃ  _Ðe€æ¦‚.ˆ Î‰üt  A† ÜxTMÊÀ ̈3⁄4  Â1Œ“”±o...Ú–TR TMë u-
0Žs -3  Ó ]Íà€"Zk†“$Ìzð@à{„Á R†6 ̈Éÿ†}  €¢ Š6Hò‚  t 3⁄4·æ :©íÁƒÁÐ9ŠF¢ ¬ýÕñå£ ̄:ï  ü- j°P“ „Ó!£μ,íäμ  Z]LêV 3Å¶·9lOXc jU1⁄4Îóê gá;T`M tâíB÷ eæŒ £ ATM 
äøóYq± ohÓRP Ñ   /t ›  =§ ̃çHå}-ØÓ pÑh  —|’s}ë¥6kúàæ5Å3⁄4” ýå,B!.4èl  flulˆƒSßöÝÖÆŽ^TM š„&0ÈðŸå>Á{4¿ ̈ ä†IÐ\@püSvØxÄ ÂŠò õÖ«p€Ö@f&°μN€äÊ(È1 )g  È°Ú1wPY W$åÅ×1⁄2 hJ‡bP  2tÔ·ÓwÈ(   ’rÆzöIÕ ̧þôá¢%¶ï  CÑ^ËS3⁄4¥ ïmˆ ›P·‹  Çi0ãð 71⁄2)&†›ôμƒ¦Ì:e“lQ ̃Vm9Š1 1_QZ¢ø–§=o (Oþ@ÊÇ ¦â’? ís4|Ô_w”ù–|   ŽÎfè oe»  ”mŒ÷Ú@ó€I2 ¶  T,  / TMù¢ |EýdséÝÓÆ«pÚ;§ Ð ìú~ã0ÆL6ðäu2ŠÌû hŸ ¿A]žU à1⁄4 / _%“  ̃¡4ØŸ„gÃ   ̃—W
§3 Ã8 t9“àh'8b_Hq¤ ;õ ̧ßŒI  1⁄4AŸÿ-Š óm R@kœXJ¿V8μjì šzðêÅaþLzTñfyñúˆ‚÷(® €ø[ão‡‡ ÔÃò|a–¿à#s;¤ˆ!l87è)»9Nn“3êõ‚.“  êi>&qŸS|
Œ1*ð #üŠ   Î)ÁÐ(< Dõà*TM‘ ̈ mßTM›ç}@4‡bÃ_MÏI&  dš •a2<Á· 2imð ö 3BmJF(ø ̧n§vDÛb+μãM” Àa¬ô\1⁄4μvi=  àøòÝ *¡+.8   ̧f×Ïhe—ÒÌ ̃#ÎÚ°x~  J¢ì ̄ '¿É>g"«Ó1ƒ» óÌZ ì1 ?*'0 ¶jï‹4RB-åwõž]®Èz â57 D>á  Ã$k1⁄4£Æ1⁄4£& ́{¦‘k k o9|ÎûkÛ ̃ :‚  <poTæ ́ÇÃÞà·[ xVÒ+çƒ'– ‰3DÙÙ¡Ð/ î#Šö>fÄÝ] *f\îožt ×‹òV ̃~  ̧®b%Š’YÜwóØ )’ Ìá<9‰§ ÌTO1ÔJ7ÅpÑŒþ§âI£ˆ,kî¢pècœq‹›r ̄ jÁì)ŸÃ hÎY ̈Ü&æzpf cÚ.·àu1⁄2n Wþ9!3lØ$Q9© _ÔZÇ3...¶2Ò+ˆƒàÖD¶‹Íñ  Ó•”òÙÊÖîˆÜ*9Iw&Wt Oe_:2œ vÅZ Ä   ›6_ó–êÎÛè>l  49
¥ß’ ñ éj ßŒYTMƒ3⁄4HnòÐ–fL Ó ÀŸ`á»‹gˆ[rf$oÂo5TM¦‚  tCaPÔ Z6×â‘Voíw¢ N5 ̄œkF'Š?–A — (ïeúuÂ •7E õ ËÅEhbI±‰Gœ*óßÁ 2  ̃ÛLF(Yì9ð ̧ ?C 2  Qð#oä’\†ƒ”íì}Õ,)RèuA2†...“H%ê Y ÀV”FÂBÞéŸü¬ÏsÄ)Äc+ã...ovsŸ'Oqã„{NoÓ ̈À?7?ö
 é6μ%  :Hq ß–<iÅÀI ¢iäo7xÒ¡çμÀE©mG 4"š®1⁄4•{†;¬’í#gUá Í‐ â]Ç2Kqã]Œ€ ^Ä‚y7±›Âˆù‘\r¬2î  ¦(ð7 Ã $7¶ßÜ`É  gq| ¶TÑn.‹û*áùümàt9» € ¦b<þw·Þ u   ́Fa:1⁄4 ̄ûŠÃ¤åîœìôçÄðò e|3⁄4#N÷ã”ÊÄÆËÓ0š ŒaŸ Â\F¤ö ̈ V  3⁄4Z ̃Gy‚'‹ÙCU T‡62é 2z>(šwö ÆèP®¶Â€‚†e [ ŸÔÄS—è‰CÊDŽÍ@¥Š+Öj]E»V  1» îF  \1⁄4;90ïÙb ‹€ÕÅú-©ÄZ‘Ô[ †qC öN®abk– Ü[c' ¶1⁄4 ̃)Ã ́Ãä±pt‡ ̈^ C( š ÎëFk(5é¶U”g B8ù`Ãã*èBëZ3ÓNËlμ ƒ3Gê3ŒÓ!‰pagÉ”
7R ¤ ̈ Ì*Z&ÙŠxÒÎsè¢EAïÄ 8¤× Ã...ŸÍ ÌÃ¢s¦*Åa )¡ô ìQOÎ ̈μÖež1ƒ 1ò ÆúyÌ.>·î 9ÔR1⁄4õçâé- 1 ¶ˆ ̈åW¬. ‘M¦acsÕ3Þ ̧:ˆ2)‰Ì ^~%ÆÅ<bDJ_ o÷Ó õä 9®KzÛ'mEˆu3i31ëç“6YžÅÿ‰È“=q7Ó({  f3†Pbrò ̃ *_ 3œ[Ã 9¿©BÎ-+Sà¶•ý- ¤”Êæá,¿//j μμ’ TM4?î_~|R‡ËôwB  DTMÚ<'d» ~  ̄ç“h?põ ¬büo·  ́ 1Q[ía Q’pÜa.~yÜ pÜ¤?μš§*DZüi ƒ1<íÌÑ" μ§F1⁄2¦)w Õ>¤`? —ó e.Õæt ’4a®3R’Ûμ„‚2racô ŒH@‘ Vj:~ ¥ÝÝ@×u_ZÁï¤1eÁag‚$ ‹ê@'Ð}q¢j© –N3⁄4 s1⁄4øe §õíb›Üí-d1 &Á ¬D9<(‹ ¦®› ü /v1⁄2ãh–9 
¬,’2“ÝQÍ® 9!£zÌCãÕ[j   «\ êñl × U°D ̃óÎ
 PÔ ’ ̄œp¶GÞMÔ¥   Ž2Šîe7©ÕŒ6YPáSúIwŽ3+§ÎÈñiUÏ,“#å/ècšÆ_U 1⁄2 ́ÔçMcÊOBrdÂ0Uõ(±MTM$ü3⁄4  ¥  üÁê –  ê¡»éR Tž£Á  Ìý(íMâñ4TMØŽ„ ?j £‰!4Œ Z3’‚ŽH è{åâ»Ñi2 õ ÈÇ ̈WåÎ£>   uüB—
3ÊäWè‡À`ˆ PŽ <*p;Tüˆg2$n¢Î!Dô ÕÓš ×L*©Rn]])pU oO ?+£P`   ́Y+ ñ öìç wM¢~Ba94 ÀÖ¬æLwÐ aø þaE a¿TMIU®g1×TMÁXKÈi~Ï”TûL-§ò  óÄŸa ¦aVßÊ ò¤4„Ù® ÖÏô’S¬± 7S\ i6× 1⁄2o _eœ«Ãèjö d]Œn? ÌˆÜq æô à1] ́ü ̧5éò’ÐÛ9ì ̧_è:+} Ä th©CQRÖ $ ̃¥Ùh3Ê) }ÒÙÇÛñH·Æ2 +
=Ç›
C+}

 “ñê# Ù{è![2 XÛ~2÷lGY»T®¬É £3G{ ÀN)Ò%[eÈ Ø)Až©V òøuK`>[» o 
Û%Ü„Izo,Ö  Ð3l ̧Å¶(IŽ&W T%†   Û[ÁÉŒ’VÁ3 Þ”, Èë/Boûûd ={•ü   a§ μ€> *ßHòrM ̄Òi4¤3 ± [ènoué ́ø”‹¥UûØè...\T...JÎxTMÛY
å«Ô1ÖnÃOoSo¤U œ ßlï  u¿Ú}1S ƒ•®åúÓ6&ù Ô–` JÕ8ÐpùT! ^&μ0›Êœ ùa ñs¤£ €#žbg“g» ̄·qÏÀ ~;NÆü é üEËE¢‚ÍŠ3¬¥%a ̈okí €à...¤±* )3‰: oÈ #è%ãX...3⁄4:K ! œGé¤×êM®€sh]®.>iM’  ̧aQ|Ù<K”‘ iþ ) ? /o1 M{- <-l Í¿ ø!>e}_37TM–ë¢TM}  Äá ̈õ €Lg‐  ̄£Ñ4I  ̈Þô  ßÇé 5 1U  Bû
NÚIØ:øfçe^otq4Ôμl=ñ œ"‡o w1⁄4Ê ̃uô¦áÜG áç‡/
f¡ I«]·î,  ́ eZéy8‰LÓ ̧  è nö«I AÝÖ‹Ix–Œ3⁄4 \ Í\XÜ îÁÎË m ̄òM  ̈ò3⁄4 ÂIœ ívséA&ò‐
μ+ US ‘õÀÙ(2%É† sFf !&ŽAæ 0 i"Å1⁄4q(¢ô3 »T:ÑDˆHX%3⁄4 2]6±$ôÇ€T ́±‰ sÆwbŠ0"Ø”   Œ"Ø,Ð*fUV ̄ã> ˆ¿°®x À
¥ÏTVÎ4TM àòU”/d|Ém ́O W±1⁄2Š©Ø;_ž±OD @•Qõ£Ÿ"ì 2w:Ò®òÊ¿Eô 23⁄4’òš8 ¡a} ‘– < Ž   üJ}oôN O7 ÀÕMGqμV—E1 SX7  ö1p kÚ= A»ùxÅ sÇÝ~o ç5R9 šÕ}ýæÕó   ̧Kàýçr±1⁄2H? ž|I B   UÛ“p$
 aC8Ä _ï "Jð3ôä¤Ý-nŠ õF] v oD   ×5âÈgÛ ̄Õé‚OÌ Ä ç P £ ûŒW- "P œ  ‹Â \«dR8qk4~é   7vKŸáv^*áXm bnÄÀ 'l”Œ"š°~œÞqÆ2£\äQ*HyÃÔ&phó  ̈ ̈X cx‚¢` ̃ì)mR¢   2FŠï£«4øâS Ss]€ž’TM,§ 1⁄2BFà= „ný _¶òÒQ [Û Þà•»ÛÝyý¢Û-•6ÆI ~ëð– 
ó   Ü¤ 1⁄4ÞzμS*TM[ Ü5·Ø ̃¶ ¤ ́ÝÑzsBAãμμ6os Cve©¤Dj‹ÍÅÇ‹úõá÷ ̄÷ö w %  `‚iÎâ' ́‚ö¥e ]46 jV+ ò3o ±[Í^2li[S<%Ê_Q¤‹{pË2¬(21à¥ 
‰Ý)’z&ÿ...›È ïG×Ó cäY>~ÊÓá8”âÎ¶ja—ïÉ kTdoÉÅr“ XÞ 9 ̄×ô*1⁄2Ø9Ü>ØÝ?¢...< óa qýJ Á_ÿ:Ê”
â3‘  é'ˆ]\ ́$Ò·T§u£ ŒŒ ́ˆÉ)@  á Ý€h]$“÷À 3⁄4 ‚—ë/¿ƒ¥G v2aßl–J» û1 ¢#oÂDŠîÈ °9o ... # ̈Í ̃ó îÊ›Í €šBÑÓ Fõ‰Å6\...å \åRá M ðÁ y ́ ±,)óHÜƒý8... Ü  ›€êK«¬—"EQaX  Tní*ÊN‰ ̈  ,¡ ú~& x ̄wŽ6TMÓ@ -Ì 3Ò# ç' ¬ãîþÇ   |x ý ‹|UN''V3Áïÿ N6ÙÔ=À @ÿ 8Eõkj$xμsôÍÞ‹Cù3⁄4„! UæPØ|Ù Y 3⁄4 §ÓI|2CÃ=ÜŒ„9€]ét2ëMÉ- )T*Q=)IN~„Ù†ùÿ–Œ%-8ñ ̈7 ̃õ£ tƒ¢1⁄4 ̄À‡ /«_Â`×)uáfðïÿö_ RTM ‡ J– ÌÔ1SeJ1Ù°1⁄2 6×Z *U©51M” ' õS2t `Ò{–æ  G  1§1Ü"ã1E#m: 4 G¤§#F ôI uÏ,
–‚éò×†ƒ)(,¦î@×ûýMÂÝ S›MñkH 3⁄4x©;ÕÔ ‡é9’"èŽ  RP €`<  àAíd ¤ Œ  b"L3⁄4Ôîî ò†ü” ‘_Ÿ&Nu ±Žë~' ŸÔ î  &9 [qŒa@É ̃ —p v8Eš Ê í"@»æ4lçäà¦_1®›”bH2yh?N âj "z|»ÐLnZô  Ì¢ ̧ÅA5 Á¤^`.2  ÌÈl $; @ xÔ " *Y†VÀ0%Õ€S&Ÿ ¦{d K$Fø 0X}òDi¬0Þ2‹ &#=w Sc Mæ â 1⁄2  ‹k sNŠ53 ©ž Ü Ûë$—±ÒÜ3T ù MkTM–Ó;7}x›¶Ó  Ïk–  ˆãžÛ1⁄4&μ4nD[õ VðÆ>Œ {ô/Qæ‚ 0 R ̧“Ùéi|©" ̈ˆ—ŒI% çW °ã•$1Ç wÃaØH13XˆúO¡JLå) ́_@’@t... jæõXõ†;ìöTDÏÜÑ ñãSš ìl ÓÑw'âáb
‘7Tq PRRgëj
 Q* @ßdd¡o¤×%μ3·f¶‘Ád•è 1ÜÅjÃ–+ w’$ƒˆ  §9 æE"T   ‚Œ AZ†iÓ#kÜ§À@DîôYŒ| Åå÷_ Ù—ë ôG Ô&ÉìŒÄ .ƒ€CƒF L”Jp¤„ÄÑ&“Öp  „× V~Š 2¢1q¦úl... Û ÙZ)$»¶AÜ Žd{ ”
bÌ{ ̈}R \BA ̄œý‹+ |Uô O«33⁄4"ÑD '...K×ç ‚ÌyéÜ=Vàpè Gà
8Q
I>$z
xVÞÅ| ̃ù{GYê—›t\©Ì¦ì›!áÁ5ÎÑè°H(o¦è¤”pÚ ‰kT:¢óØ>Ït
ú3Â]μôÑeÔ›Ñ< ]S1†€R¤Ñ¬Ÿ4hoÚˆ Ó
F1USÄt1⁄4 ¥Ô–A z+ Ð‰€çm W...õ ́0 |©Ï=áø|À€” VC% ́,Yl Šž”ë) ÀTè‚11YFEd   »/ #á‚/À Á —  ̈L^÷õ>ìO t ̃án¡£%Æ Í ̄“–ÂÞ$ Ö ́Û¦5Ú ́N4_¿Ê°ŠÈ§b ©—ë âððÍþþÞ 0Ìt HFÂ Ù” €Ù$g7š9jjN Ð÷3~ú<žM? a3⁄4? Ñ ôs?ÂëEÉM®H‚ Ø |1ÅTPμμ›JÔá’.= (.|N†Ù  q+Uža1⁄4šp"L bò...«'’Ëíu Ò~SsHg€Œ#© K °JxæQ :Ê ÊTM
 «›a K4c1ï ì.l 9žÈ{[ 8¿‹k‘i›=Ÿ Eã1⁄2 ̈L bÞ ö.Ó[Hnç›2 1⁄2b ÙÈÇGP×Þû@ƒ—þö73œ ̧‚]4d*\9]BVg ? w-;â;ÕqW—oAš #%#:°1⁄2ŽÙÈ75‘ÃéIéò ãy ]μØ j Æ ¡—a Û`  Ï :ÜÝ“]%åâ%ÇU&V1¤Û Ik  ü  ̄OVVãËÆÅÅ úÍ  0 YØMa@±Å8uRØ+®¢¤ÛæóšüB1°È°×Ø ÎaÊ1⁄2÷* ’
 ( j3  ` L M O !:Ì*Ñ’Þ ô
Ñ®Ÿôfx|0TM œ‡ÁÁph}oz8êJÄ"Š ˆù U„B‰Ä    ýQRûƒ{úË7È  @ %ÅÀ‹çf*~o  ́  W± jßÄ È ̄ÿ[m·aŒçaá^ã×zÓÄ(T4ûÅ ¶š#®s¤¦J FšYÌ#B é  Ó2±kà(ì ÷õŽμá uÄ¥¦Í + oC'kjÙQ¤ ' Y...ÊLJ >a”rI)m8Õ
\;9 ̈ sq.GL #ò € (Ÿ E¡±ƒ ̈ ; ÷’k  mXÊáX-:¶ =ø>TM•0aJ:Žz ̈A ¬ŒOi3" XÜ œø 2 ˆÕé»^Z ¥μÄ Áæ&!å ̄‹ %ÃÈx/— W‚êL‡Þ ̈±üNÏ1z†jÞ W‰@ðíO÷AæTMsÞ$ ̃ æŠ ̈1 ýF¦âe ̃Nõ ́ ̈ ©›F2óÎ<%Æ$§”1⁄2}äÈ€v"ãwe6“¬uánR Å ̃WÎe@r‹{ç•Ù1#3⁄4ó*|“e±1‰€,õa”ù3 T0{*þÅ“‐ R/UößàcTÙ×  Õ ÓÝwOé6ŒHéùúë1⁄2£ ÍNðŠ{ÈïñXy3⁄4NnöpÈ¦ñ”ùóˆI€ f3ÂË25K/ Ô2#'o1⁄2 1⁄4Û&‹k  ̄Åd“(3⁄4

 iG ]  ÿrýåî«Ý£-”   •/ “> ̃Åƒ 1⁄4ü hËH 56â\XxVÖ):/
1ÊˆÕ£ŸBÂ©+1⁄2'(¢=’2JMÞH§W@¦œLëJ’  ¬nå1⁄2`X"Z öé  –T7# 1⁄2 Vò+1⁄4J2â¥cI„
v)t %ÍÖ ì ^wP€1öaAže 72 ùc äê...
AÁ ̃§°PD& ‘ ̈dR„6 qnÕÃ “óÑ +‹V§t 2=uîîêŒ•ôRJŒKL;þÊ¦Ø°Òßo'þ¤H°] Ÿ•y@Nß’Ïa3@ yÕž>K  ÿ *Z §9‚!&XúÌ` KfS ̧ TMË   Ü I ”Ï>Õ%€1⁄4·ÓHw GØ`‘ ^V= 3/.'.F
 –q Nìa†|JÓá¬ 
&Q{ $ ëG6GŒ  5– ©c‚ 3 "
à 7Pôþ¬   uEaÊ
Ed ́aŸ·iõ U>" áf)ùwhc Á·  ̃ Å ́ÏiÎ•C~Æwß•9qjø»wR Š ̈ 4s ÓüMˆ`ö<E š<rK{JYNÒ  ̈› X€#÷Õ r6 G†
óq–  ˆ&Å” I) P~x Nú¤ÐM Õt×‹ÐOIÁ ƒteSÝôž R{ÑÄ!2S ]N'h>Ú 1÷Õ ̈yÖ ì=TM  ‰p•u¢ØW8’zñ î"¬ÚIQ·4¥HS'êØÃ  1‰ C...× ́% — EæYgG&þ“‚UœcB„,‡ 3⁄4çfh+òœ5μ” TM-Œ_¶iQ  ›á%Ô~IôŸ8 ÒSÑt |μ ,=l?$=i‰TÂ§€e – €Q wa U+š ÔôŒ§  8ñ...JB?åj‚3‚$ ) Ð Ü8€'  creéDQÃIJß ûhÎQ‹†ps¬3⁄4vg1Ž{± ̃,”¬ý9μäƒ9äA”ËŒ? Ú2 ®”Ãñôadäðœë”X |Í % ́ Ñåy8ÃèW7 Bƒ ñ~ Æ2Wû‰¡¢â73⁄4éžõˆ jÕí =šaÚUWž &  1J| Ÿž¢TM©K6âÔP fÿ(Ø   gt...× C• Ô:ðBñ¤Í#HuáÙQ ‘...†ò€xÔ€AœM82 ̈TõÅ  U  ̄ß' ô' $ È4 TM ý_ZêÁ*%Ãø'%Ý {öE]gœ9 S `ð1⁄4ò}D‰Íe+”ÔTHž 1gÚˆÖ¬©M+ ̈¦% F“žÃ 82 žg)U¢)!V›n& Ž
« R +¢/gHØŸ‹ E (XUkPHä@ ̧ Œ¤ƒÈ ̧ãÝÌ3⁄4‘9Àáúa”pD÷ ́ È ...2BÉ§ø^ ̈Ÿˆ0ÏÐú:yí’ "Eμ£  ¢F±Œð0Óy,l ̄]  ÍxäNˆ¬¦Òtç) ìÎ;•Y a*k\ ŸOB"é2o'WÖ= ́ ̃A:Ê°,zÝw1⁄2 ÒO¢”Ø|Z Q  ®ñÍÙS>;  ¿)ENBK ̃üÍ §önshÔmøZè1⁄4   ï*[ˆ ̈~D1ÓÊ ïÞƒø'î F L.ÐÙ>Ä¡“ÚÑœp“hŒI¡úu‹ Ö” Fx`èÅš&n lò"ÆñEæ ̈ Jîm4 ç«–É/s3hð  R † ¤8 ÿ ́S§OÕ`× #=’«éb êo1⁄4¦z %&
›s 3ÆÉ†
1$P ÍÆìA p2±`É.mR{s I ̄7›L”è*ž D£.Ð¬£‘CA-Ížì H I1⁄4„h — ́öÏÝóu  ̧ò ̈ MÝê“'u-
Ñ±6Ž) Ü¤Ô 9LV ̃,÷JRñ¥FÂ’-X•P óÕBå ‹F¤IWO¥‰2 ̄K€ž Œ” P3⁄43⁄4`®aÅ) ‰EóEÿ‚ïr€ 1« Å[ \
Ë`xWμ ̄ì ß,US’œ1  
–Ÿ<~(úKu...Ä J1WÒ÷–ÈCmgë
šX×\}1ðÔ sT 1ú  J IJ¬}&óF¦ a[¢μo=Gk1å]ÄŠ Á-qÅ „JÞ[¶Ô9 {ŒEâÛwq~U»}1A7]¢ ́«Í €üSa ± Ä•ø ÷PTZÃ1⁄4}‡ XØ=š/6GcU,R ̃Rï<ê1⁄2OμL]Ùf*#`2s3¬øY ›5hh–ü¦FÒŠÒ}Ö±«¬ÃeÍî&‘R”  ó)f¿#ëïM1⁄4© ...|<ò”¿D ¥çDÖÈ•Dé Ì àD©C€hÈå ́nq`'YžH¦Ó...2;R~U   ;0 V UÇIšÆ'ƒ+–o48 1oJœ–
$ø Ã...]I“(2 ́û®°L¥ÿT 11⁄4TM œPo ÞX)†k1Å\ä mkÎœ ñá{ 1 9FËZ`wëZêêØJ”
äb8w®Ù  ̄ ¶ D R *z€=  E ]ƒÄ– í áR}ÒÃ ̈Ý°*ÙÆ”Ù,18TÑ‚]ò`£0:TMF› À! Üáˆ  áÞŠK¬D  ̈1⁄2ŠÓ ±à6SÍyäJÔ
 T*Ã\<MUÎ :¢i ázã&ÜOúhQ
 0d¥...ô%2Y- ›Ô’g Z2v>%ËÂ§dÖaäX|–l;Ê’2 ,)k2 ÿ “®’å.¡] ŒýF©ô‚À ;+[BDaa ßƒ$Eñi  
ÚÍÕ‡ ̧üg” t" ́Æ!?íæÊ \J]d  kí&šè2 Âì 2*% B\À”“=–P6uØ¤¤áTM
DÕ€ë«ÁY 68n8aÐƒR¥ã ^÷{‰HN–ç¬m0   ©ÈU{3>h  â ÎF W] ̧1ÆXmâ–1⁄2Óš2± ï; 4c%ã±œùV"í!
Æ‘'‹!UlS $s¬‘9«n‰l aÒ«q Ž   =n?a±f‘ã 1 Ý4μaƒ    §%mÃ®KÒed8œ Ø—  ̄TB ’  :rAû  ̈b Åoãð ç,Žòï·;1⁄4  ̈QÐ åÚ 31°J~‹ ̈«^c¢ Ö B›£)¬‰fcŸ ̄?× nÇî_3Åâ—è Ø$“&ç — Tm2qTMN Â1⁄2p 4 1Š ̃ ́Qp<ôÞ_éÌ|p,÷£1TM” ä5 ̈ÎÒ • ~¦_Ã«Â¤ßÀœb° –¥ £èˆàiu{«†G+Ð <H %ÛH2tÌ#CÌ r Ó<Ä  Ñ*R3I<D›.D»3ÔàLeØi‰ ̈5y:‰ãˆíGJæ öw) ÜÕé$"?$ZéU£? AÙji{«’ê[ÓËõí-riM&gŸ...3 'Wx‚3}Ó 
1Õ"Þ‘ ÑTM
•3⁄4æ í]QËmO  Æ!   ø 
°ç“8EÏú P_a<§ [8Œ‡,éF¡.ê ñ(1 (8§μŒäRšŒ Å- “JÏ ̈MY°ñ1K¬ uÇ¥ X#äaL8$ïμμéÏ‰1⁄2c» ß Öμä q žJl ¡d`  ß1⁄4Âi®A-¶t Á@ Çym‘ k–¶pÊ± œ žh ö–-i sr  V!,:  F<j@áÆ0î÷Q : Â¦T(  š ñû n!qHÉ"ñ[ë•_«Ëμ6  # L1⁄4TBÿI¤Eh Âμ · g” ñ ̄xON f  r¬a;;Z“¶ 1N[ ́0!y02¤Ž μ–ÖZ†3°^“ ̃ #× ˆ ›Ú kä 9‹ §~4 {y ̃  si<ð]UõËuËGzS
[ ̧<ñ:21 V5 %Vœp/...ÝÅŽ1f
*©–Ã á€K-Ä n°q*ë1⁄2±®Õ;‘ ìo1⁄2 Ó$d®&1⁄4ý0qa_  ̈\2 ©ŸfËdPÐG '   Y'^ 9|†Aˆ æ;}Z“Ù
§Öü mÑÜ1ˆFü‰J£pÒCÚˆìÛ Äà Z!¦ ́§jURQìæ¬`î‘ws  ¿ðœ  1pí` ¶ oÅS¡^ Ù*3⁄42ÙôL]çp¢Q»‘ UÉ¿ ñ&E DÛ
P¥ ¡ pé\a„Gù¶À% ̈ÏHæah‹T§h,@ ke« ¶X3⁄4O1⁄4Él_ƒ›§ ̧ 3õý•ÑBÂ= è Áˆ&š[” D*T·μÆŒ„ #›TÈšã Î  F‹3vsv@  #‡ oãpz^W6sGs¦ & é ±a¶ù  1⁄4”7'¥”1⁄2ÔI ]‰=DÝUD„ !òOμM ) TMÿ [FX1⁄4 v#8Ob" ¥^<Æ›‘nY .zu›b‰ “1 dLEKb j1⁄4 ÷ öþö1⁄21 X[“r  wJî@Š f›ráL•ƒ ê7ñ~BF9\Ë3ÊATM„3⁄4Ë ià”í N"G6...üTM:Z1õ7 /;â= Gš¶—
Ž–
}

 yFo›¶ü ù k «nT? 5ï8Éç ̃ÍýPÉ¤»4i^‘Ô-s ̃)¤=¤°ÈÖË—o“ ”<Øù—7;‡G]öGÝÌ?øXÄ#ô” N_Î9Mòûí ̄wKÊ· —Ëôz3 ̧Pz Ü{Z¬11⁄2NI ̧:Æ” õGHzJŠÒ £Ç\B¶ŸaKnkU   !oŠ  `Ä3⁄4 5:@Y Î !
ÛëÐ÷®]_<j =&¤"÷a4¤œ!ë(>‚  ́tTMk { Z×5%—ˆ1i... ¤f}&o–} ã«TMÉ¥...§Ú”z Ë”  ̈õ % Ï#Šl õμ†ïòJÜŽò.ž R‡ xæ1‰ F ¬R†Á  ̃USÚ2ÛsO[— 7»BÔÑ;Q4 lÙÉmúŽu ×O/oœ¢A!’YiÝqÕSd 1⁄2èμÒN§úÔ@ þ(oØ aƒ2  ~Ä —é.åîRC1⁄4,ÓCgçÃ wQûÑ Ùvrp¥í&Ð ̈QÌÆJì‰œ5„L ÿ|qqÑ1⁄4X&Îy_ Wik3—J”_Io”Ã+ ·—  ́ï €m†Q”ƒ· _m?ZZ^|gW8Œ`uá8 =Êo ]¶í” Ý6cQîˆ©.oä Uyó1⁄4BË.1⁄4°wn÷lÅy»åœToÐê;C¬¦ˆˆ( ¤ëÝ0Š¦dàT~õæð ̈¬ø|^v% ̄3g ̃w»o|– th  røÍÞ›—/\0È £l±CJK2\€ËgB¦2r#Â% N Nß‰6Ýq›åØ "Ž1Š¦Üq  } Œ 9± ®T Ç[ÂÊÍZ°Õ7ˆä°ùžkúþÖÑö7Úd Æ ÐV =F_ÍCLXM Í{3”õ âa< v6A ê4ò}ÿ%±Ú<...3 i ÊlDë ‐ ƒ`’0z ‹1⁄4Dï ãž'#·QJJF3⁄4
“?¿
 §Œepz”Ž<T¬%‘kmj©u2žé°é+÷€ÎvjRxG8Æ1_Êœ\+ÈNÉVÈ7„V— éyVÐ.8Ñ1⁄2 >n nïî*®èÍÁn§3CmmÖKò1⁄2;ž ®ØGÆ’–î3⁄4x
EÙwÆ Ò e   ́...
màPú4μ‘Ï3¦   ̄  yÈ Á  $o1èF±I4Üo×á× þzD [^|lË5ÑôÃœ^dÕ‹Ü  ¢S‹ < ̈1⁄4Lç÷à"1⁄4J•þ”ˆ>1ŸT1⁄2d)©É   TMáÔ2Èð uD—IoÙ f0*x ±Æl 21⁄4 ̧ TËoR9¥Ê5G nO ̄
’xÁTy6õ£AÈG§ >  ÌR}žraRÅ¶4KVâßíõößþ¶iÅ
‰:  Æ@'Êö TMNÑ< â41· ±DàL ÒMç\-   Ï$TDo  ‰4 òeE3ø•=ŠFsX±l© 5 íŠ„ :jŽqÌ$Ë3⁄4=HmÈa Cμ
 
 Òf àQ1⁄4cÌ ÕÞÆÓ7 %(  ˆa‰— ‘æÏx\•È ̧Hsï‚0HY &; +m0]Lμ.../3–    ÅÕê¥1⁄4f1⁄4 ŒÆzâ ¬j,Îë61•¬šáI‚o7—)0œdé4 $ `.M3⁄4=C _G  <6‘'ŒTM¬ö €ëîKGañfkÓð$‡;;ÀÝ îå1
TMjA#ø øvÌÉL2Ô7[a © !"¬ (p„  KœB üÄýI• 4ÛlTM 1⁄4!6‰ÀÃ1⁄4‘Æàa°£ ̄¢Þ96ô & | 1þÝwßñ3pDÁ?tp—Ø í(Ø$W  ~ ö"§ ?œPƒ6 ©npì áGÓ•¢ztÍõ*ZŠ}§ž ]‰‐
•  AU2è»  °äu m 1⁄45RÉí\  „„‰ýD„NKŽ¬Ðê]l9‰Ûo OVì sôxs‡Ê ƒô¡ tšŒÑŸ  ~Œ*2@ Ô“ø2 ̃M À}  Á¦‚)„#hJ%Õß_@ ¦èa Ÿž ñ¤ gA< ön ’ Éxkxž „úÀM j ÌWB ÑÀ?Ÿ ¥A+øJ¶Ô  ¦3?ˆØô h!ŠƒN°
(†éõ·Ÿ 1¡ qšÎÐ)Žú] –â%_¦€Q? |Ÿ   Ñ ˆGk1⁄4Ú  þ   QÕ v)êãŒIÝT|àÔ1F7... „  hëÙdÄ÷B‚aì  Yn»M¦QÊZ“]~øMšœNá  ̈,RÅ {œ¤ñ4TM\9¶ $š ÏN p’"' „H±b$...Š)Ju_N)r Vl5T‰Ø—üÖ3±‰ 334  Àá Ü2V Þë¥Þz wþƒÃ\ Úó *#ÑTMŽ€ ë í " ©£¬Ò/B8;‚ ̄ ¥ d? <£ONQÁjn ®ðG »Ïß qëÌn(Lß @«_Ãö„“
3⁄4à...lÔŸ$Á×çÀxŒâ` XÂx eÞŒ`=ŸOBh9 œ`HÄ ”
J Ã&œ{“  Ï aÀ‘p> Ž} ]ÁE   UþKø>9I©Äù(h îÎƒè*Øž„ñYð n3W 3¬Wñ  ́w ‡pð •Õû(ìŽ‚ >æk þËI2I.Ò÷1l“A<Ž û) ð ̄'ÑYð×h ‡û  ́‰Ìî | °÷ P Í‘þ  Ùð*xEúÂ¿
a $'@Œ¡O ÅðiÁ  Þq ®ƒ/gï ÍÙy?ÀÎ ̄ð 2 þÒ v>¢r ¿7^&3 ñs’å#P ̈| |“LRŒ 
ƒ€e„ ê IƒƒZ 2îE -L ̄‚×1\ CìŽ .¶g€X{ƒð – ˆÅÞ þˆ÷2WÑèlö?þ  ̃... é$Øÿ ÿ ̄4üÿý/ ,Ó áU£7ž Ë>9›Eqp Ûž&
ˆ#JBÏc Ó qpøþ
o›ž ‡rø?þ?8È¿&“Q4ý fðp g(Ì\øÓO ̧Ú‡WÐ18ø~ïð›Ý [ÁQ8Mgçñû z~ \ûE  avûÙ{ô3;JÐÓ<IÞ   ©£_Ïâ!,P †;h¶~Æ ž 1‹:`- ìŸM§p 
×ÃÁòåIœ<;Cúš©à é:|ŠÓÜãàïúÉ Pμü‚ Ü^Ç ...X %éWÓ 8EÀ(`‚`&7ý1⁄2¬6Á:\ P “Û —¤}2Þ»€?
ÏÂÁl8Š›ýItÑŒú3§°·“Ö{øà Ü OÃIsä•uw ”... Ïà ~éÇÙäÊŸ?Þ†0‹1⁄4 ×{øý ?? †1⁄2üÒa( »TMN]öÏžÁ¿æ0Ê– Ñ»  ̈ÙÇhø, O®2XaS‚õ1ý-B  ¡X úÏ&3“ E¡ÈXõÎý*.)Y?¥ ̄ÏøÏ =ôk8äfý= hÂùw– ¤ EZÿñ=}
È :.«ˆÖú  þTØ¦ië?¢uE>R»ô = §°¥ ̄žõÑavÚˆSØ¤}X æì1⁄2]Í'Œëdv–Û‚C3×  }ÈïμOQ×‡?FgçÏàš   Ó Ÿ_Ü% ̧ëÃÁ }*jÁ£Çë Éà  Ž å}r1⁄2>œô?NŸ,=ÃëYÚÄ«ïx@‡o únm‹¶ ̄÷ùCî$å þõ‰õ aE Ÿ ́Ø‡Ã: €8}vA ŽòœLý>ù' tk0,à*œÓe}<ŽÓpò xæópêƒμÎžõtôãûády) JsŽ¦õ îμ1=p õô=üÉ/gÎ3(u5äÏíGKO
:á zëi‚ Úæ{õ vÀ` gê1g#t 3⁄4Ã çïÏà Ü¦“(ÊL wŒ®§øý2¿w9gìúP>=;TM Þ ¢‹ÔÇ ë ^ >üY ” àf`ë  J p£“ü· +1öËogx°~ öûP Ó+ p•ûß ì~ýÍQ°õúEðrw{çõáŽpõŠ gùÁøŠ·kμW  – —Ú(ôð9Þ¦1  í–†°¦ÕG( K•‚9&cÛ  ò" úxÊÌ~I{¢0Ç/n®û \àVù~  Én sUÌPù – ¬®Â»Jo6-
ýé Ÿ à ØÒü¦m` €G«« âT‹ÞßöRûáÊŸÚ++ —V   ́áy»Ý^}ô§`ñ÷ ̃€  ‚ ÁŸ0[Ç1⁄4r71⁄2ÿ úsÿ %0 F¥...z
Ì§Á'bÐPvVý–2 ̧*øÙÖt‡hNo ë×ƒ—Í—Íí&üù?èuH M ̈   ̈  uzß ¦2? Õ5K’HCÅ'Jgìâ¢<€i8Z’   e:BVÊã+‰6
 ï<>‰É¥c ä  žšÁNG>•J3 šŠÚTM5ú¬2Œð· ̄âQÿy<’rÛ }ÓqLñ„ ¿Ž¦ÉxÚé1⁄4L0¦vMŠ â“`Ajw: ‚ $Ã!†J oÛ4ê—ÉÙY4Yã ́

 dÕ  ISx aíŠÕà„Ác
< Î& ̃a©;žD] ä3qw £çIt
GÂd6a>Û:øúÛšrþ% ̄¡Éšär  ¬,'Ï0 ‚ ‘Œ“   ŒäEâ kaàμ•ˆîž•st* oì8d1⁄2ód8†‡k^d2Ã£ ;  X Ó6<ËKê• ÍG  uo îRÑ(¬” jî6Ì<RDvq8ŒÍÃ š    Ôå F( bŠYŽÙMgqÂ lìåÐ 0  Žc62t:>tr¥êòTMÛ•rU« Aoq– â Nu‚1 ¬ó–¦@û%...*SÊ 0 G!† N  öƒî
 KP9H1 TMÔ±L„C 8zUE(.è3 ́  o<ë©JŒç”ÅžwåA— jZÃ{ ô &. ‹K ÏÏîë ̄öaåƒÙH í P  ò9Ó~ÿd Ø,ç5iO)ZêåvŒ–μ  Æ êRÀ•  ̃ûüT¥ ¶J3 o;~ – vμ1® ÆA4L€5žŒ‡¢:ƒ1⁄2  iO„:-$‰@—RqÈ—È] õ(8‰0ù— ̧à“&:œ è ñà%)íÕlØ èÒœrV€'l| μÒl/5  á`| 6ž, ‹ü‹0žšà  x 0ö=‡ÔH§ýx¤-lƒéôJZ ̈bÌ ö—Ãñôã(UvSμfð   FÓ1⁄2Ãàqðí+2JÇ®@/VšKÍà;eðHh  =R   yÚƒ;- ohäCŸ ̃+t` 0‡<ä ›¬ˆ'· 1P;ÑøâÄ@öWkBëÑåMÙÕ1⁄43Z®Á 4í*/K6ÊT`a2g í   N“¦Ô *AQ*Ôn×^B û ̄ % ) Uðý›W&Iõ4u ýX1⁄2 ́oa% ¥°JSÊYä•·_‐ Y e×$ár« Ã  3 ìJî~é']ÉŽÚí!nt9o^Î–!kÜQÚ3 ̃ÿ /S¢Ÿe —Ty»sÎ1⁄4)^¢
€ ÅãÙ@Ü€&úåŒ3  B’v†Û*¢’ÐŽ¦$2a.U†ÏoG E,3⁄41¦ ̈TMoÛ k 9,U ç¦^  ¤Ë H  àIê- œ ̃Ð£® UEÆ 3VZ...r  × !ƒßa
òAE SFu x7C 44 #ZÓdŽéL )Èo9Ðh29ŽAÓŠ j ̄7o  0 ̃/μ :¦3Å ‰67` ̄Û'8R Z {‚¦ f°ŠÓójñ ZÉ|9 ̧OqQ'S“» "¦Úi—Ò u±7x a‡NãK  žäCÄ^{Õ‘fõ“‹ ¦—c×HÎW#y®4Ýà“R iÀj >8  . M¬baÁ®pŸi  » »AïCÃˆþÒ1öÈ—ì : Ã¶bÑ +W¢\2 ̧t3Y‘μ{±óüÍ×Õ Œzï7û/¶ŽvÄp ‘¶ 4... 
Ý†£4>ëtX—Yi„Ï`$ž—Ýp*„§‹É}\ƒÑT‹ç» ,  bq Ëå 'Œ
ÚA3 üL¶ *U M h ýÉ m;tR a F¶g ¢ìBìU1 Êàaœ...Œ@ ̧ Ž†4±1⁄46Þ  äê...7“  àf $1*® J›m. Ú|; ¢ Jè+È,0žÊ † y {6\•YxÍÍÜ¦QÄZt9ýÑh îRÄÂì 1⁄4Ú}MK~J3⁄4 ̧À eéμ ùü ÇíöO»è^çî°îÿì+ý qž× "p ̃âØ  $% ~ÔãÐÈ “ Û3⁄4}Zc°!dB eCóP®Fü0°W  Û ̧DjQå3⁄4Râ« L{5X| ́ ̧X * âÓ’»E+ R+š ̈ðŠV   h Öü} <  &Ÿc’p SáE—ßè‚d‚ ¬^^Y|Ù¥·T^^ ïä W1⁄4 1⁄2ó ̈ãS øü Óx»i9ßã%‚»   ž?x}.– (`_m m1⁄2¬V¬
qJ) ó Kv×é ¬lêÔ‚y×wA m1⁄4  Ã,× äg öÜiû < 1Àü ÓNåŠ§d6ëoJ ˆ3%Ü , #åx QÈ  ̃L2ê...§k^×Ý^a... ý=Ö ́¬oÖcŠ¿ÅÇ>‰ýy‰;Ð E*œ\ ̃* æ R÷ ž -
¢jŽ‡¿¥üÿáÊJ3⁄4ü¿1⁄2Ü^Yyô§öÊj{iqi±Ý^þÓ"|Zyø‡üÿ÷øQ’j  kù* OnR ,ý¡  ̃'æÏ âãÃý1⁄2ÃÝ¿ùâþ Éd”  ̈‡ .a;[_oí3⁄4Vb G _2Eþ. .÷õþ×Ù‡|TMÒ ÷ Q Ý›êê®Jàà< X ôó7'3Ñtf*P¢Q ́$~1·ýW  P ́  ›ÀYáöji ¦‰1⁄4`eÍ  ́ °÷âÍöQ÷ÅëÃ1⁄2×/¿Ï Ô Ö×ƒ‡  ¿Û_*ì U\ZôjÂ}d÷Õ›W] W°crœ‹)ñÎ ¬ùdy‐ ``€T{/ö‚¿Â ÜzCÜ3⁄4?] Ž@~óüÍë£7 0†ë  ̈Œ ̧o o  ö^u÷ U7‚„=ß ñ^   O= ÃÅ;¿ÿTMoÖÈ ÛTMQ¿¢Z0_9C– Zíe ¡ `¡¿ïa&UCÔÂêÚ {ò~À¢U Õ  ¿1‘ßž×¥ov^>ÉíR»M„n{ Ìú/
ãÑì2xÈŽŽ$}nYÏ i· v[ÃNöYGÀñ §çnÉ›ùí‡ÝW[ Ë6ëcØö£ÂrÄnbŒ+ÍS.ôhkw9ÞßFÐˆ`ç` ̃ –3)É%f®x ̃V
:4ËÂÌéšlvDIêÂ4rkâV—zy & úqT-¿ ±  KöÊ5K!F h6‚ b{?]×ÝQ¬9ÉÒ©°Ñ ̧‘ÈÛpÔüo  Â,p4oÌ¿  ÖƒÕæb{1/3  1⁄2è‹¥ öÂ +Íö"Gu=‰¦p l: 1⁄2)...ù6Ç‰C«wÀ‹ ̈i§5â ́ñœ&3⁄4ÂÉ¡ÑÉ1W¡üñ kN  V÷l œ„ƒtÍ«ê\Û ̈2Mß;”3£;HÎRè’aÐf a–ù ®:Q^ŸA“|yê"e]3ßõ‰Ú‹Fc-Ã ̄ËB ̈ Ë1⁄4RŠÒŠìÎç[‡;ÝÝ×‡p;x  .¤óê’ö +  ̧øôrëõ× þz3õõNðr» õñÏ« ÃCxrˆŸ· 3⁄4ßß1ÆTM€
Û ü'
aîÅ‹ ç»[ ̄»_ ì1⁄2>ÚyýbN  ̧  t"C— TZ}Œ**O=¥   ̃aW •“~á3õŸ ÿ>úÊÁl¢g! Èâòò ojÈ ìc4 ̧ i$3⁄4...
eá$Z3a ̃3⁄4 €7ÊŸaNÂàÿ|Rû"= O§ˆ   ¤r _ ̈  
÷š ÉH n Âaä 2¢†;2•\`Â8±`ý¶ÀœJ.1⁄4 Rç Qç[w®a*1Àb \vz ~1⁄4Ã”5t% ÖÅ £ 1⁄2 §w ¥+ XY¡õ-`e*yð| ‘èày•4HWÀT<\Ÿ¢ 3⁄4 zu;ú.bÌ} ̈ÆA¿9¢! b5! šeÛŠ‚ó‚7  qŠ†±¶~B‘] 6  sjÈîÊã  ë¦”  ZsJ œTM Ë`ÃœRjËoý¢C  iKä 'z Îð  k ̄ÎiÇÝ„y¥2XWXÊÇ%¿ zFObŠ 4h$©Õ/RçÙðHïSÉY ¿$*‰
+1 ¿_rx  o,y  Q‘pO É3⁄4Ðu:ðm ±ê«I2ÜÂÐ×UÝÔ1!xý6 ̈vìã ̈E÷o......12ôðV ̈Z Ê¢†·BçbH -ô e1~.$}  ̈y`Œ|ýv`ì#Í %{Ãl  @y Ú6Q> ́ J «Í6 Z†Î ïË
ÙTMEým| Ù ̧ iåv ̃.ûüÚÛÐTMúÅ hÿ_{Ûü õ‰*H}Ça‚l3⁄4äØ€_rÄ <μf#@±ÓøR .h4Xã... Ä‚†24 22 ̧B=X% M  ÙWtd 
Ë)Ñ‰âQ š`Ó †qÅÜ”Ò#Ò R* *ŸRÐš  q< ,æ ̃6  ›#( oÌP ”1  ù‰ 0 8:À Ô ...
ç$:‹Ù` Ã 11⁄4  mcÑBÖ  ˆwì}^aæ õ. ̃ ‹ÀÔÀñŽéè‘haóÝ ¶t}Ã^¢}K MG ̈Ê52ý lÐG_*ìûxÉM=Kg1ô ë9o0§Œyría‰ £©Z–:  q| r‘Æ5Ó±&GŽ ́Œa»¶  ¦J= õ‡[ áW3\Ç'|Œ ’‰È Ÿ O¬ 25ø ÂÌƒ'oó
"¶caŒ  ̃øa "1⁄2“Íá Ž awxqà3⁄4ìÝJ{ í»K| [Sf/G_Æ)pÕKru;þ3Û_~1F¥ zä–’—"T±Í”ãðz_  L... yÂ *×vA2yËã—...UæbÀÝ~þLÀ® 1Î%8£lã`œ © ç¢ê‘9šÕ
›C ·Bïñv{÷V ̃ç¶
ø4×ý  ́> „Wô ú0† 4¬JE&®ÂbZ 1⁄2V,z óo ¿ÊwûÁá‡ ê/+Î‰$” Êˆ4ýÏÁwß1⁄4ahÊjK ü.}*Øjd ~í¬é0 á$jâÄß7rf _Td àt~xËe•Q# {ÄÖü ÒÚjÛs*êvZ ©îØR [+Œ ̈ïTM3⁄4?KÐò÷4 §JøÞé ÈFžûÂ 3ˆ÷  y@‚"   μ–_^#ê-Ëk”»myžÔ1⁄4òyR Q¡« /  ̃¥Œ€ [r«B“ ]Ê1⁄4 ́¤‘ μLM! N ́[AÙt3){C7NÕÇÊÂÇŠ¦c7v Î£ z ́¶mð]†jÕóÆé1⁄4ñ ©h¬Ó¥μ[4 7?V‰êÂÇšYÀ  Ÿ;21uÿ *ë‰akTMÂ 2h1}Êój ñP: 9žMüîˆÒ6Ú–J •úX‐

  ́ qem¢hÛ
  sË1e sTM©ÙÎ%Ñ  ¬q i‰GïƒÜž‰...È_ ×ŒGœ-  ’”÷ ¥ØáÈ ¿» ̃ 2‘ ̃«1ÆiIf©b  ̄s§  ÖÌ  åC û... do©äËöÙÑ„7öÄ— ×ÚÃnÅ—×eW”Ì_¬ ¿hIG‰u1⁄2¡WFðWÐ)Sà ö)ƒ9E]2òÃ‚.}—Lúû ÷çH þÂ®åà ̈°Æ † ï   ̃ã f¶ñ¤1èi4fã®] Ž®, TM{9 jÙ3á>‡$2‘\ì 3 ÂìâIÚxÔ\2:#¿+92FøC  <9£>àõkò) ž‰ `1î£9=E‹°ò
pÀK#•l–rNw uã_ƒá§¿Wßþ1⁄2ñîAQ}»Øx  Ž›êÓμaÃHƒ¬d›D1⁄2älDf TMTMÐ1| 
&W ›VO¡ÇläžÓ01 ßãWãYzn= ̄ uNeí–  ÷1g  Žw2‹ EÝ}  ÷O4A=K$e μ!yY#ÎEm’3õ®Ì$Âo%i 8C``à q&uáoÐ ́ Z μtY ÞcÂ‡ýùÏú#o'Ø 3{Ã‰ ¡ ŸüÙ‰  ̄¦1oéM§ ëÌhŒ›žñÛð}?ž ̧ô1⁄2‡2© ́R   ‘"Ú' öy[ Öçèñín3Ÿf_3  sê5”2ÎŒ7 ̈Hæ#  Ê$ÊTM¡— íl3⁄4S7í’ÍÖ ìŒ£=êœwš•ÂãÅîo3 ̈4+ÞYb b2‹¬
U`“
E:3⁄4Û:x]
Ö×Ë;{‡t e±ßl1⁄2 eÓœ¦§3 Ç\£h2 ̃ÿ’Co    PáÈö1 tœ 
Èù]Ä Ãf”å £) õ2ŠðMŽ  Pß  á ̧Ç3
%Óf ú ̄EL   ‰TMM8•qïœ3-4m3Ð{kb <$ ¢ ›ä3 øgÞ"Ÿy‡|æ R®[ o1⁄2μýÍ Yæ¬å7Jþ>” ̃€ò D qÝÞàà8Ÿ   û2±ax   ̈éö]Ð ̧ gþ
ÁS\Ïå.i Qˆ;Ü §ç@3Öa‹ û£\£mŸÌ76
ÿïû<Q ‡ Šü   \PÍ±    ̄P¤†á C• ̄Å  ̈\" À:÷É9%kÍãQ ¬ïuD 2 ‘t2 ÎÆ1‰ Ê’ZÐÔá tˆ} ò<oRXîvŒ‚°oõ1⁄4 Æ# kÐï$9 ’GÒ:L÷æš#ÎcógWH'3⁄4ÙŽQ± í cèììòââ"øL2@,øCFå^Ý +» 1Ü õŸ‡1⁄2÷ðð1⁄2 ̈Ù — Ãi[ û [ãu   z:P<åà!»è ‡žg—M 2é# ïJgb®o ́N§{“»ÉšEH1⁄4y   ‚b×°÷  ̈ Æ  ó "ˆ9w !
üÀYpž¤ î H ÌÎw‡{£á1⁄2‘ Lâ3x ’ ̄ ̃k ãËr1⁄4Ôçnsu} ‘”o«œ3` †.3\„wl±Ð w0Ñb?wPÙ•sfkŽ¢ Â| ƒ1u?›‰c-Yqv:ôμê èÓ£·+ï ̈þåã‡Ý‡+.ã‘?¶2s é ̈î W ° Ì \EÔÕmÔHÐïó"|•ØÆ9Çá l1⁄2 „¿h6u9 è'È6  æL®Œ$ I±ý¦jÕ€3FŠ3+2X ÙrÍ  àað4xôðqÐ ÚÝÅ¥ ‡ïqÚ\·!Úó3sp°w æCTM Ûy»  \¶†È X ^=§p÷0X‰››]rçÂ$üßî å råæ£ U4ØÓ  &3ÑTÀê¬ÖH©c× ’ ‐ Yì ¡N9g >)B1¥03Éˆ‚Þb$- ́Bì ÇxTQ æôœ1⁄4z  ̃·Wƒ/Èv9< ¬¥”¬wÝÓ  íÐˆ©Ù^Õ þ«hx„  !¤aÍÈ? n\CÉ 9>¿J)â6>‚  Qv ́èB c  ýs‚‰PU’oÙ‡'@ &Wd]]S¡$’iT×  Ü¡tî ñÍ/
÷‡q?"£ìFƒ¤õíGå:Ý‡†Qz¦›>TMM8 Ê  SxöM^ŠýWoüEÄ.gJ †Ùft&€Ð\<u° YS TMßÕö Ç:x ́H–ƒÃ„Ãp)ß}3;¢
¡\?|já±Ü’'v\ ¤ùUMôËëåo©XsÝ Ñ/9à2d3 >}} ú •3a1Þ`\’® zÑ Ó úêTM~ùþùuœ©lQz8kaük¡  ́x Cù/s°¬æžï×ùê7í[ÅÓaμ 8‰$ËRûÃ¥‡y·ù¡¤7± %ëúáçÏ AE ́’Â‚È+Ù LVÔCé<?t ́  !ÔAEiÎMVmÊÅGR,ûf TM/Åì :Î3 ß±RÚ‘ A'o4 š}Ñ óšPqå§&`rÒ4  -
....2BñÑÓñ®ó(—J]Ï*aç3⁄4Sq ́6æ@Ï†eQôŒ ÂõéCJs
ÅÎ ø©·¶78žaLw»Š;·e Þ+`•8_ñ   Q...ñžl¢ŒŸ!; ‡\ 6  ÌKa ;,`” /
o¬3⁄43Jãa~õpLyKÐæçóç Ñ—Ç ãÉt  0‡'L ñ?1⁄2_ÔÄÖ < G?...•l  ÿ ~!¿ $ýÆîþ |réÙE  ̃(1⁄4èŸ  ́úéðFHßE' dÎ}!þÝöb` ̈±É ÀüùÏÁ ê[Ðø uT•  Xμþî>l ShýÖ7  é %vDñ   ñ2Î§”^„2SŒ£d< |dQÁjŽ3⁄4í2¬<× ̄ØÂ‚1 r¦ÖI2œ #E“å(Cq– <„U £ñûèa7 ̃V\  GÄòÁjÄ véÈtÆ1⁄2 žR°Š ócè$Šn6:wkÂÁi'«fÉ  ktÊ å\èÖ ́
HÕï¢K ( 5ë8r( eKæ0U’J¬ˆòd¢3ÉQáq1⁄2”n(M9Q3vO–H Z1'*_ÀÚSÙS§Ð1“J Cú=2”Æñ  §:« Ý¢Lu•Œ ãë lžS åöK p»é )\P1ó*T]ç8Ò×\ éW§&2ÙÇ=6U„éÃñôak...jÐZ;~Ïì’Ò¡öHm ̈‹`3⁄4æ š” abœj®¬  Ó6 ¦K'l‘Ó‹ ’ ‚
b +  VN ¡ ì‡„tWú  ©_ÓR äõ×ö±Éy-é9•yrýž$ø1⁄4åt ́bñt°—ç€ËaxÜð 8\ o“¥žî”  :Ÿ‹[qP#OÕ ̃×y7è ’è Å# (l¥> fPË†Ö“¥gÑ8 ]; ˆÉñ‘ÏÞÒ•BÊÆÌ \ 0tÌŒ 6 "|...   aœ\í†ud bMμmÖ†  ̄~ ̧ø” k“¥à ́]ó ·` 1«Y?ç=:û öÜN }μ¿+îÓ~FQ è 
 ú×μ¬oTMúÎHzÊ_   ðG[ÌÃG ð(üÆ» ˆ]> ̄#–({¬?1⁄2! Ì μ «NÔ ç6 ;±Ö p&þ‰F2 ̧X8 A É ÓÅ+:Ò*Äâ< ˆÈžÁ7Å2«Ù Ç%k:*V\7 ¿1⁄4‘Ñ%åMGÁôÁ (Ç E–Ä  ,q¦h_tf"áu19§BÃ Õ‚...{å ívî|›I®K÷çÈ(áÆv —Ä:þ UÖ¬7Ã¤/
ìw×ó¦8oUÔdç¡ 3±Èc %·y [:7Öμ ̄•3K ́ ̧ècä ËôÛ.•5]7o‘¢eó€°ÿy§“ê#„– ‚á ào<C;ø«R×»t^eXeS § þ2 ̧Ôaœ¿è:à AëK(Î ̈ß O»  1⁄2ûÆâR *)› jV0 {μKl1⁄4¦å—š ßÓHî0pç”Ò\bƒ:é%‹†ê øíB9 ‹Bïùîë   lsÎ53⁄4Chμ€Õ`Wë1”?/3⁄4¢ £·báÊ¶Öm  ¿hGPÂÚ·b =lýý8ý’òY ï}œ>háÍíÞ°  ÛK š‹ð_{¡ 3·îul3O©î7Ól3·0›(ËùQ2jð¬ ̃9 ́,2%Ÿ * —UŽ1⁄4\Y÷·œÅŒ\μÏ) †Í £r
íÜ‘GàÜ ©+  &OÉ UÙÅ¢ˆ...Už–ˆEÞQ2êHE¬Jý 1l '
a¶ìYS Å"ÞÛRÖê#þŒ¢Ë©ØÐcöÍtzrEÊ )] 2÷Œ r ̄ \¢g>jAŽ  —wm4Ó„ ̧# A  ̈z-  èvÅa ü &>ÔÖ ́á „ƒ s$Ö .®y<Ê^l
{~=‡è»Áuça—ŒRS  ́ Å 8•2†%]' ̃\ C'Áú§ÉDGatÃqžóuN_ÌP^,ÑˆEÁh ’:@$DÊ  J¤©"-«+û ß‚äž, yÇÚö ‡»_ aì3⁄4>b ` ... ) ajBEá XsO  Æaß¬Ý å"Ç]9žMíÕÂˆ[ÕÅZ®Çôëd Þ’kÜáìdBy ̈#Ñà^»j> h—

 EŠ"BàÐÇk¿Ft,!I9Hr«PV  ,¿ óL3⁄4 KÖ—á L_ÛŠ1~(¡%¬MÎ5Di Ü»w/p>Ãâì3⁄4þ:ûœ?»@ ?ïÇ "}· o§ð N" [LsÏÃ  ù àôI c %o3⁄4ZB$•ÑRÍ† C§dg55IÌOY¡§Ž ¦ ,Íq+  Oƒíédð`;x1⁄2÷]¶w*•fHA7TwÆ,Gát1⁄4\F6aó7 ̃Ø_e‰¿ã μ&Ìz “ò¿É–; ? ÃD5» 31⁄2š/nË” œwcd ¡d3... J32 ¤ƒ( WÛ@  ̃\‹9†¶žðšÈÐÞ\KN(h‘ð ̄ö þÚñùo"èÐ±÷TM – *þ  È·O <š>
[¬mC‰6Â ̧(ò/b$RfŽúAaHl 8O2 Å@å÷rÔq÷P!Î¡œˆ$•2 ”òV’»’ ' úÈ›Âœ naÔœï9žz  Óì ̄°S3{h Jn|  ̃ 1⁄4é_p‰{Áõ V×rt€ý„¦¶H3W`o£Ž°xÒŸ×WÅ¦†8gX 9R÷øŸ£H$ Eà: `ô¦]8Nà,Ò7m9#$ãƒä— @¤ilV  •Äg O   ̧   Ê?HÒF”ìÃMá©8ÎŠè1w£© 1–X£7ì›‹<«É ì¶I ̈ Z{BÁyÐ 5ÇØBÅÔæÙ'W ,  QƒIöË,e
&Ø
ƒ v PâÐ;Ÿ$£«ž% ÔýfS Æ¥’ JÉàiPõ ÁÝd 3⁄4G»ô1JÏ;Auž?„ß ê¡Õ ›s>A¶ù †2 ÉYJÚ$  ́¥3ÚÈWóñÚ¿Ö ÷,Ò~   u±Î y × Þãm4¥«¬w  ̈øaï1Þ§ÛxsA&  úB j'  ÚüQoy2,Û°{¦79Šˆ\s6
Ÿm1⁄2 ô4ŽÇ‘;åb¬aÔ ÍlÜßμ¬ -ç  È  ÑÐv# ̃ÆÆ Ê¿Üë¡X¦D( ́uk‰WŠ5 ́Ôn ®€ 2S£ N  ˆ3⁄4ô Lÿ<  ‘{0‚oPß4O3⁄4Õ'Õ Í E3A   •¬ã æ ùð‡ei/êSÕ,Jx’V¥ ‘Z€ ÏœμaBl/
•ì[c81 TÐs<8ò Dy·  Á  Íãà Y iÜÒ
 ÏŒ /ÁÖÍŒæ7SÃ+XÓ» yÛ9£Ù ̧Óà]K‘¶‘ëä'–  ̃Kt O ̄F=Ó®1⁄2©dxyt<3’<‰b.®FÅ8£BÕ3Bþ€À~ ̧‹ÂÚÅ ̃{¿ÓO9sÑ+Ô« ¢   f  ́è N _óá>7ˆ§” žæ çFìH&, C!E]H ú|ÐIQW¶ÇY...¤u  ~ß›÷xÔK&(àDl2»•mÕÎ¡BZWný(/
Š•üˆn €Qh÷ \R3o2è^€ÙÝ‡!r_él@îxŸø° gyb×gAýÞ+š£rã\  ̃i...I Ï ̧’Aè| 4/ ñ Ù Î ¤.Æ8á TJ¥l1 7«OúËc8lßp? çÁÒf« }l fÐÂçÏ Ÿä’Ýˆ QseÃr1⁄2Ø9<:Øûþ6m#ç¶ûzûS ¥h‐ W€ Íñ°r1⁄2æ1© *ç  p°ÀTM o›ƒ  1⁄4È ? ̄Í·ŒFÓèŒ—TM1‹öÎÑ±Ií¿4A*¢4Þ= r®ìÈ›%K[ ‐ ¶e2t Xv¥ zÝ3ñY÷< F¢ ̃Ê»€å¦;’ ̃ ×ÒÙ×Ð Tì(
¤£§ÞS¤GÔëfâìBã (Â"3¶þŒ“3YÆtT ×Ã$1⁄4 ‘ éúSyš’- ‡;°¥¥ûFÿ   FV?9- eh FHTMUè$? Lá ŒH§C} ̧à$ H¤ $Ø7MËöd^ ¡ ¥Ž¶  ̧9Ø W0ËF c• ̃ ̃†9 FjÅTMŸ2>1⁄2EŽØÊCØ1⁄2
ç]9î©4>%wWõ "0ÆðÊ
z M;^ñ ̧3 NX¦1⁄2 Ãé 5öø±   É•
ƒ  nÆi ×á ` ́¦ä Èig W#ëù$Ç“+)åÜIÝÙ£»” 6Á·úñØ5Žœ§`sVzý†p»þmE1lX3⁄4zŠ4ÛF¢n ̄Ù O5‰1⁄4ÉüF O<o $ îIÌ Ø?feiš›?¦ÉÈ*1⁄4 eêT...îöêÊQ +œP ñ ̃<—Ï¢Ë1oËÙ ø '4 ̄ O§”3k§ ¦pr M›  ̃>...}\s’§‹ ” ̃QYÐ€ ̃ ’ æ2 ‘vô¢‰èÚt:GÚ – Ken\ 2¬^ÿ{μÝ>nÖž ÷ 1⁄4m/ ̄>zòî ̧ùø ̧ÿiùzÓZBÌ...U ã“
cqiåác€Ñ®>í 7?/Ô®3Ö ~ÿ
°¥òf4Ë   åŠq ñúÒ >|x[¦Uu0©ù. + ov ·oˆã\ËñFú  ̈
¤Á}ìâú  Ès< '{QiÍ2!¬ÜòÔ‘Q ”Y‹\.X 2„N A Q nAe 4®©f O<o^@pÈÿ€ pòÈ¶ë3'ÉÝn ¥  ̃    ÆEqŸuW7î p-
Ï ÁA, |žË‚B¥yÄ[¦ ›l.®  2Ñ¦j7òÝ ÉÝ ¦òŒì 'šÒL¢Óˆp /&–Ï‰ëW _&ìñ› Ûé3a ̈Ô> âûúÀ€”oò©( ¿æ b 7 g*ÊEvME(NâH`r®X é.T~Tø -Ü1⁄4¥:@èâö`R{ñáo1⁄4 4¬ ‡MÈ®Éí) Kk3ô"ð {3/p|  —
<êjÎjÃÙ’ øè  y3⁄4F...ëc N...C °K3⁄4 ‰| ü À0Gn3D©3rí%gå3⁄4ÒþSÆã¶NnMÈ ̄Í¦ ́” 9î0Åþ.tÍlˆ†’Â ÏÅk_ÔæOÌ ; G ‡çy© Øäã. ̧ üÒ0$D ̄3Ö3oá¶‰ ódÞ<þú;À„
1 ÿ‰èOÃ3Ì6‰†Yþä2‹2 e ^9<Úúz÷õ×Ý »  GQoÃ@GYÑrxO3¦21!<¬F ́¡‘d“Ì ío†W ! äý`<ãH ® v6T  DÙþW ̃Òr æj_ÂR3| oÅ“iÍˆ© “t þp7èÙ+6·6Æ&ÊÑ@ ̧ˆt õ€ßî9Á ̄YŒ× ^¥ Lü3·#ÎÕP+A  " +. ˆ“ì5Øü ÷þ mËaýäcÔK¦ŸÅP ̄_[hÅy ©]Dð Q‘ZdáVQU+ÚóÆ4¤Œj §KŒèQ TM £ÄÞäÍ<z_< „Z]c9G‡AÑÔ  –Y ' Ñ¤?J?ŸÄ£þ çJÕEu V/š  ́Ü.ÜnþŠèw E MVúIÏ¶†k]œ •„ ̄áˆmZ¦ 
@Òˆ(T«À G aò3!ÏW P¤ í #ëÿ>o’Ü änÒôeg§Ñ ́wN’3(ÙÅ+cÕÎvâßéŠâðÝ.y® €Û ¦¬” {vÄ{•o   WáæÙOV¦ÕèrŠù.ðåPå[7!|%ÝçFP9 / Ü× Î ef.Òó  ,  ^ z-oÀ~"G Ü1⁄4ü©lÜaÈ– TM_ ̧áý "L{ôQ91⁄2 ̈nY~.Ò ÌLý 69¢°í3ußd]¦JH«EOc öa0|T}3 ÐàTÍ
ÊTÃÉ LwÍÑVöÆ ́æUi\μÅÖçœ\Ô 
/Ý  ©ó Ô`¦IþJ6 ¤9h`°fL‰§ègHa  ¿§8~ËM w ̃
ý&¦ Æ÷<1⁄4„%[Î†dŽQ "f:TÊ‰CAù¿72Rû¦ZQ›TMâc›«ø&vVü: sÉv9sòGRô†Pßö3 *¶òÙ»ç2~ æ< ̧OCkÑ ̃Üœ£îJØÀQKOj š  ÉCmË Ê¶ Š±1 ø 1a
4.ü"XZ}è 1⁄2(ñÒbLá
BL  s€"i` ôë~,ÄFTù_Íéû|,24 r" úÕƒ`l8uIã÷I‹‰Â÷Ž,lU [[ãØ| öaTM ̄)d  } EžÊýq‡ ëw¢à{‡ ~ {ò1 ,#=‡Ãî° ̃~”0ÃS5tCTM/‡S‰Q ¤c‚z Ô ,çÀÀÎ  •‹ÑüÕØ  »£
UÞÒ±ËáDÄˆoèÌ’FV8 ̈ À:Mœ‰ðyju ÓÉu0ÓD0‰û2ûÓÈ¢ò“ˆ}$‰ÊÓ2æD Uç s œÁ)J”(D¤ò!±  2¡Y«5?ôÜ3y#œ  Ì «Ü ?:¦Ä®“MÚUZ3⁄4a   áÝŽb)Þ $À ́ 45gS)tÏ’ μ)lús
. 8LTM5Ù‡è•ÈxJzß 2ÐÑ ‘¥Ùjæ:#ÏiEFf|âå=Ýtî5 ö“ŒÌà Å È}Ÿkl¢1⁄2ÂU öXg3⁄4íUB§mL ... _‘ $ F3C 3Î9è¢‡šÚáG

 ýo  ‚|n&Í......rv!
dUÅ]' Tu_ŸäV÷SòTÇ[3⁄4ÊÙY ̃\Úa ó a€ìõÔ  C1⁄43⁄4 H¥ “ K‹TMf 1⁄2Ó   ̈3⁄4| a1⁄2 ·O]øò#”®Unî%  ̧ ƒÆä4Èë×μe  , ÖR%ÝƒK¡é—x‹ø 1_ UÄþdÒgáBˆ§Ep:# i<j0í *< ŸMÂ3⁄4" jkA{...kbo¬-ñì} áx& ï ƒ@ÙÅÖ×ÿP ï  ̃ ä‡ QÚ¬œ åyFQÌïêQè i " %‘'¦ÐCŸë—à tÆ- Õï!zÏcçÅT%U ‹~8 ÉSTM”Ü ¬3 9anèx hšyqb]ä†y1þ‰ ̄® ÿå%^B_...“8|ñœ+ÃEJ"¿ Þ•„ ,Jb Ç >iÑÓJžý ú-ê:–EaŒ3⁄4{è}é... [" ^:†ÎëvkîÑfê§° áDå)1×:Þ"ÅÜ§v}éúó I§Ç (¢Fíø't‡Cy
;Lž ̄1Qù°axšc¤ £MI ̧Ñ_ Ç#3ËhŽyËÐ Ô’5!f Q’ã(¥8d#6 Sîw ñ«× ̃ÿ[ ÷p ̧®  ̃ÃÝSQ;Ë9 èŠuŽÕ¦‚ 'ý&ÜžQ¤M" >ó›3⁄4 ‘Í£ )wR
±Ëoç1⁄4øúâ#*1⁄4¤ ̃Ì| ‹ ‘ØTM*3l
L‹ ® ̄3¶2°Ø'ÀØ n0d %œLé‰öPåK  ÆËeóˆP  ̈:À ‡s" ‘ÆÐ ùä`®p+ Ä ̃äË y`~·Üto... “«ûub2ã^ðô ýI2&ÉxðP  ̧ms  |þB¢ŸXðÃ04 ù AÇ‰;wD g  ‚p<&aI41⁄2À 'a 3Çj2x±R Ä¿ÿ×ÿë¿ÿ× +þÿÿ9÷íüÿÿo^Kÿç 5pø  ÇÞØç; <õjü ̄sáÿ  Aßþw¿o‹V/   &§§Í©êä? ́om»o@‡z3Èôì Ü·¥z° \ V ̧ofS©þýCû¶jÏ ðfãsŒé ̈§î Ú·‡îš¢Xcþšþ×1ðÿß¿ oÿwÃ{hÒ ́ ü ©ÎÝ 1%Ô ¦ü–ç  Ó¦x:“ 1®¥ã   èQßaÛ5¬ ’v1⁄4Âû–EÈE$| ̧‘Và©¿JáÌV•Q‰è  Œá g®(ü ÅÉ‘£a2×} ð7›M ̃(Ó`iX·‚¤Ÿì¿4ãB À ‡Eamã2'#μó ëðŒ ÁmìÍñ G‰•  U‰wU¿šå5Ãr3è‚Ú3⁄4· óBa ùÆ®‰·ê„u
•i¢\b–ÊÌ  wz Ý 'á“6ûÕJFÇS'Œ‡Ú26 }^ 9#§átÒTM«‘ áR?§8J2&uMrä_„QÍ`Ÿ...yäB8oo ¡ ß#  n’‚ë3ž1êß«Ìw o‰1⁄2ë1⁄4»|çÆ OO   :} +’Jõ^ñ >Q>øÙˆäXÄy 3TÎ C—å ok±^`ñ! ¤e ðÐ± ã a ‘ ¢4T, ¡t©YÊqžÿ _ö¦À’¦
á3Ç ̃e§¿ ́ùçö I¢òã¡ >%mÁm3ŠPÖM Ìš ¬Ø4o5þWî€jÙ¡+ËSžš* T _.‘ããô<ê×š•ÜM–...aÅ  öçï± \9ƒÄ°ý 
ÛÚˆ7 ûöû°Xä!¦ 3Gk 1⁄2Äã±   3⁄4« ̧À6j~øðV)¬ ž23⁄4  äé),ÑÓx1⁄4 `Þ±cM‰ Q“Ç _pÿl©FÔ5L¥-  ? Î#ßÄ” ^Bv X~
 $wè áXôÈ×+Ü  e3 [ÜIŒI#Ïf€QÝxl‰ÐSJíEš 1⁄4~©u4IUÕ
 qˆê 3qŽ4D3 ñxT ÑSÉ— £ÔÜ ` õh»ûA @T\U«    ¬1a.ÞÊêËã&<~gUB$Ûðlh0o*€7Ãç‘gÐHœ °
¡d„B/GÛÌö «;M(¶b•Z«çvÔ    ÃÐDã÷gFÜE   ‹Æø‹”•:ÞÐ 79...”ÊmÒŽ*¥Â )}{N GÄž oœR‡d Gl§l »  jÓYoQn—[kr* ̈±¡· MÁmàÈ, @.  ®ažT  I¬ cú â÷*o}/
œDu; ÝŸ Ñk¥y!Ø[bþ‡ 6 e ‚1⁄2ÜÊ5eÎ.ìB; ŸÁ Î DÀ / Üœâjl -óÞu[Ÿ zá& !ñ¡°¦G¡` !
±•“kÍ‡  à €®s°‹0° BAÚCŽ íÅãæõZ ïð:TMF “úá¥bHD ÅJ ̄3⁄4ßÝÏsaÈ4%Ñ nâQˆä‘9•  & 'Ñ9æ” QP  ê;K _  ñÝþ’ “ƒM ZÀ•fÿ`ïÅ›í#ôéÉÅ$á·ßŒ09  ûa“dêÅRd !cwßØne Âp<–§r  æE Ñy4¬  Ü ̄¢~3 âA1vT|yD Õ'«# ̧ÊÍy±@|ëÝ.û‰YhWÕŠ%  3 mòüÎUMwÊoN]êùL1.-a Ú2ùç9ûa” n»àŠI(ˆ TMŸZ ́ô C
il[®îr^[ôWQ'¿â\|Ú &çá8¥ SÃH2{ ̈É–ô‘bø†¦ ü¤!Óñ μ d ̄Â Ô=ÔG $2”»6Â©ZIâôò©u MF1@ÿê1éyÈ¡ z‘[¬ Ê] ãÏ7âÆïoâ¿tá z3ø 8oá|ÞyÎÊIj¥âu –.‚÷W:I r¥A(1gHc›w/É £ ] TM1⁄24W‘I4Nš¦~ N°– ùÚbÃÄ   à 7gs«* pw®'Ø ̄ Ël; Ál Kî¤* Õμ|;1⁄2Îýj1ÕŒE®LH #gã¤a Mxðní– Ì· E ÷ ñRm{l&ë [ ̄ÎÐ`Wk«S agýTMc})N hé ûü1⁄4âu ƒ ÅÚì‰i Õ)!‘H aÚÑ S Eï(·kË: Ý® Jàšo'û«£LÓ BëÙ”Z “•› Vš]
h¦_û9C3 t ̧š„5X+ÝÆ‰ÓI k|x} x  ̄ 8S)”éñ á` š< ì  ×ùUæ1⁄2À>Wúå1pÝnëþzÛ·€
++ ̃ÃÛ÷Ô TMŸˆMd V: &Å®'Îð* Óu_F,æëœ/øÕÕî8xsð’Ã  zŠ šä P‐ âdÛ“Ô  ÞRãÍáU“dJ¿Ð‚[TMÙ#ôltíb:ÇTM)r, £EZëm Û^z ®K1⁄4 <ÑqjhVÍü ‹‘sð «®mòðO ̧*ZN¤õà,VÖ‹*‘  Ê¿5 àïlˆlÅ1⁄2œ±âÖB¥ù2 ÉÙ1Oú‘I ̧Á’1•  Ðjž) õLTM§¢Ú  I8ÇYÑ ßQ Ñèlz.bM—4šÐ (5¦Î  eÄwI< ÅQI‚ðc‚2Ã ùÑq’ÆÈB¦Þ1⁄4«]Æâ9u!ãœÆj)oŽ —† ë'>V ~#Ø  \ÁÉ„¿ 1&  , 2 ÓFÊ‚cctƒú0ùôw ” „ ÓãfçÝƒ IV÷Û |—3ÎawÃ~  à2øPF(>ø3vÂ1ù I+ ̈1⁄4•t@Ó®rXÑñ¢»ÐwxL3⁄4ˆ:ÈTMb‡9ðNe62âìT 2 z1⁄2w  ́S7 ƒÒ Œ -â4*ã—]TM  ÄH...°h2;; v+C ̈MÑ«C&ýã+Ž– œ-Ó1⁄2Nç+Àì7SØt Î  `ãw2Zj–Ðô›Œ2» ̃3⁄4 íäØTM– ƒdÛ Ÿ ‡’ƒQG§uõg¡ûvñ ¬äu=[ë^  „Ü 5Wqê"AÇoô*Oþ/Û×b ́Mr*«û6
3„àÝÆf•@ ̧{•    ́” 6t ì  EÄ›Çöó‰©œ ̧LRmLÏŠRÏ ̧÷ }1⁄2 1⁄2s   ù ̈Ù „ÄíÊ
8ä: y }/0 $Í“Ÿ–Ês]¿ü Y °ßÌíK Mü.TÖnð 3 ÂVWë... <ÿ.Ü?§ƒð,μ3êÑ dè (P Ç ̃p róml:  ~S\ /Ž”®¢â×Ä7]ze¶ƒ ¶Y|Ï x¦  f{E:€› »  — N{æ(ñ É !æ8ä1⁄4h \W'— ;ìÜ5·—Y±þIaRg‹û. |tW
GLë x|Klz Óð@„›/“33h‚7 €Ö HÌ ÙM‘’"Ñ1¿Üz/÷3⁄4¦àjÎåBîmšX53 ̃OyL 31åÓaˆF > « MmèöÊuYÉÀ ü  Ž‡=‰ÎÂIŸ.
“É©μD)sòECF<âd  „†ÐÕœÄÞ" §1Ù ̄UFŠ uÊ¡r¿C    ãŸØ±ÄN ! {uˆ/zã 7îió ¤Ð3 ú/ Îyö"ñßÍÍà±sTMŸc „z÷TMN”nzézÃ5ƒoUdÌP8[¥B ]ö Y^‰°êÞ+ ̃”T9Î  ûs¡ïŸμŸP: 8v.ÔßÌÌ ̈>ÿ 1⁄4ür®UN @;3•2‘á7&Ë úvÉ»V  ̈D f }
Ý`2 \ÖI3× Êv•2»QEùð3 U 3¿‰ŒE~Eÿ‚ÃÑë1çrÅ“§3‘‚7y   ‰K C^K9ø<£ögÑt|1

 ‡Õ2—¶ ̄‘gaÄÙ$¿Ä3 ̧OÌYðpuuy¥ <yâ ̈ ÉB‰â vÙ‡Ÿ 7-: — } 9‹Ý°K μÛ 5 6 1Þ±Š ®cvÓSx‹ÑÃËêK9è eU¥ì8 2 Ó Ö
 å ̄J†iÔíò±HOTMüÂ8pμ1[HEða '_...
3=t)V}JGg›Ó ̧8:ÔùSîß íÉ›“|«pŽo Ú‡‹– \À=iÝn,¶úìæ!e JI"›  ̧è  / ]^ïeÇ| ‹O3Ÿ‡O|BÎE&B¢FC...»
h   Ä ̧ XÏà,ŒG¿ Á KÉ M/œñqŸ  ’ñÄ6  l5hÁ‡QÒ` Q~ õÎ#8 y£„z¤Æ'kp ÄœO-  sv;ÄœÝ 1ó¦äw   «ož  ± Çâ#õÌCêû¤ ̄   ̧çŠ|...ëäTM  ÀdÜ dFþýßþ— T&Cû ê[ypN Y)?  VWÉðÎ p ÝžriBOó1⁄4Á1Â1⁄4ù jo 1⁄2[ó’7Rùœì øœSz®y1 qbTç ̈XAZÈ d¶“|
¡ HÌGÊN1⁄4È ÛIb ̄h aÅÉ±μÌ33⁄4Do·x:3v...&’7e = 'Cb¦  ^ì   çFbâ.¢ ‘ãÒ Ò óÅF3⁄4¤·ê†dAB¥+ÜwÙ[/  1Z2–X\“ ̈s Xø©Ý vUj"3⁄4 Áda.ÛüâKÀrÒvc ̄= ÿþoÿ+-Ç¿ÿÛÿ&7<œð”
XÝ>p»I3 à2f~£Ðý ÐÙ.4OÞ2aH2‘x(2 » DÍ3fðƒà¶¡
 ax"œ4 j p62IØÎ<ï›Ý L  £þ ¿fò^Î;g2š 8vþôŸõGGæ<oÛ   ‹6 áçáÊ ý... ïïÃ¥¥åå?μWV—Û   ®¶Û Zl/=| ́ü§`ñ÷ ̃€  – ‚?a>Òyånzÿ ôGYÝ8x°†òd‰DÐP ¿~ËÇ ÏÚk; _Mâ3ói° ́ ̧  ́$—Çzð2ù21Ý,Ý ~þÏ Ê  2Fw!"ÜG€=Õà3Ë ̧ö¶?hZÑiμ¬ôœ~lúÙÉ rS·Âƒ){ààÍ(œMÏ“
\IûZfÎvñäþ õK%ÔB N27]£Ï’μ Ýoñ«-–q ±ï6 eð¡I ˆ ð¤x¶{ ̧E VÌš ́ÖtÆ[ yT Ò%þhŽ JW1‰Ì“M‹ÜððÍþÎA§“WÝ-ø‘s®ê1⁄4 “ˆŒso“ñpÍNkm ì1ö k~Ñ›ÍWXc” N›‰3⁄4ZU^ü 3⁄4ƒÍB ø% ̃ØG-VöéÄ74 ̈®æo]ôÎ†ÔEéN×êHÕî Kxt A» 9étò  x8MÒÿ|Ã2Ì,î6 ́‡Á£àqðäŸ}
€: ê]Ç÷ `l  ú?ð ̧¢¬þï7ì i¤£ 7§μÝ«\aj¶ PÖ3„I ×r OÎG^©\ß©bŠ}£±¢[EËo'Q  ̧ü†<VnV (S¡páó3Ù) “/1 WPt WoOÙ¶@e ± -+$ƒo ßFð GO‚Ï  §~ÿî”À‹—À†^<oƒýW©J 2 GÈ...Ùƒ)4R2qÊÑtósÔu£ {¦ ̄ëæX8 ZÕŠvýVŸ#uú^Ù†o{‡òM 
ÞÕí*tžJ‘ " ¿    | } Æ“ †CFXÿý¿ù`,R_‡¦ ́1 B23⁄4þûÿåÿá×44 ‹ê ÙÔ ë+ÔÊuÒÐé‚0‐
6ßu1¡ð ]ë3 ðf29s†MÔMM  “ »o U1⁄2Í1&à hl3⁄4•Uz ,    1⁄4£ë ̈Dj RaË-3⁄4Ë‰ 
 ́ , ýí[@ nÊ‹wŽôŠ"TÇlMmf¿TMË ̄ 3kžËÄ\÷ž|‚eõÛ a+ntXGQ‹ “ÚoS §ÝÙB~]§ÓuÌûP÷¢ b £I·— ‡(S– ø17 A‰îû4Ðê]O T»  û$ûÎ«Ç¤÷×]8ÚóÿI—ÌLx4)\-T¡a–J4z¡3CÙb_Í† x3 @ý " qÿŽ~ñ,Ãú– ç“M(B'g+à  Óœ° %9û %¦ÿÁ7 ̄ é—k £KÈ[ `}?¶•phÃVCÕ©>í4È-ñs  ±ôóqë Ç
©ad3=    jvå]Ö^Uu£a«ÛôQ¢¥èÚ–ÑÃÞHbH‰y 1: ’ä1⁄2øaâÃŽU Qμñ°!!Ä±ÿ9§@Ñ1 <” ̈(A  èZN?  ¡\ÿÆ <2; ¦ ̄uùøa÷áJ L¢°O Ü>Ý,Ýh/×—W • /X‰†"«pï_ƒÖßßÞûòÝÓ*u—1⁄4P/ãî» 5ÕqqLýŒ  ̈ÕÞ §Ç‐ w š_RÔyËêEA ́¬Ãl Õ fà{ I
Jýk ¶TW êOa <oumZ  zj ®bñ’ U”gY2 H M¡ Jê    G ̄)y «}j«ž$FÃÂf0—¢T2Un @? #í,Ù€<3⁄4UD  îëd j¦ §ípv2I€í E€¦÷ƒsŒ5; ̧  ̄Òà ã±éíâ 8ÜFÂcÍ¿cTM"I^Øƒ Ms ±T ́’v‐ Û„O ëdã M) ̈žÄUG1⁄2@Ô×NßM/H¢Ó 2c" ÖÙ ̈§Í–0s ‘,μð gš3Ør7•ÒgÔç ̈„16?nË ÷]e}‘zÆÀGŽ»Ž• =...áD áà}C¡w£ TMò êûFf xíMêêâ é¤‚iý–Í[ƒnðg‚   ñ €ŽÌ¦É
c•äpz¿eÎC5,ÉhƒÞsç£&3Dè8çÅ * ‰‰ f{m Y0å2:yfÆ †sÍ1ìÕ¡*(± –Â
 ́  ×R1  Ø&éijuKböì1⁄4þöSåhçà ¥ ̄ôgÃ Ë ̧Ô"E>ŸB b=øÙA|,!«Ý † °‰àg #mæa G1 á2êâ9DQÛ{ {sÈ ±h áý · îs Œëyô ÄÊu ÝI1ÈŒÆ”,Õ-k£ ̧‚%y- ¦{â:Š0óÂ ̃æ tÊE » 8 €ô‰)  a5 ðùUèIŽμB±¥" £ cþçXI ‡ æÑ¢ã ŠL<ÿê±ÃV R ̄¡*Åv¤Y‰üBù](4(
j¤Æ+&% ÚSÙäàåœe Ác ̃â'ÍÒÜä3›*ù¬ççç K )GâgñnÂ„Gjé¥‹Ø1äô” F3 TM åó[  W μÈä ñgP©åìi  Ä°aLò ra.RÛu2†> Ø¡èÂI=Ï Â0í:] Ø ̧ ƒμ¦ÁëWú¬2\£ý ÁP(m ÅÎ¥ÌÊ Š Q
Ã8‰Yl •÷”r5A;ú ̈TME ̄[áÖü@h°ÞO\ò* fõœ>& ö H@ !ìŽ œ–
® AÝe¿ :GIf&TXõœ(ì&† saanSò ÜajÊ Ú35u oLúpaG Îâa LvS5nFÀ{1⁄4|\SþX âQl,GØ„E¤ h “F7A- ¥ 0CQ1 \H×h©ä *yö[ó ¦Ódœ...HÁ ‹€ÞHòÔN1⁄2...‹Ž tÊ›" ß
é §n,¢WèôÕ÷{V ïd– žo„7 ^)ò TML» j) Ç±è G+E¥v RôM¦3±Ëþà Ø5ìQó„Þ€fÙHúÂ H~%òÅÖ-g †/ ó~øe û.ç(ÏöÐ=Þô $’“= †u â ...;ÜœsÃÊ ‘ –1 ŒòÉë2\
óÁêØáÁQNø=Û3⁄4ÿN];Œ¢‚œ’B FCÖK
*k¥“Ã3 +âa{g_sÎ¬ý" È„”|aü‘9 ̃ •0’{ÙŸÑ9ÈÅÑn• BÐQL Þ”Ý«F®î‘ TMƒxu Ïn"36‘l’‡Û„OvöŒ3⁄4
Û—KonTû } ‰Ï *  ×e)μdâ†þ`.* Y ÷ äš „ ÷ÕšÝæÄx¬ iá:^.¢aêžJ Ä±ìNêæ9  5±—«A% ̈è·ŽxKÑTM  ̄.Æ„À£h õ+  
 Âó‡Þù{ùâÍL£A—±ìÌÐ°$õffXüÜ –<0 î3câ õ`É –"TM 9 è>×IF‐ 1⁄4#fîqQ1⁄2Åé0'1⁄2CÁÁug\Ô1⁄4B£   TMTM ¢3hÔçÏc‚Šóß€î Oç® boþ Ð–|Ã ãê:Ê“ú  §>?“ Ý~¤å+wEo :çÜUðé›ó ±_%Š ̈x...ñ &© ̈8R|à2 ̄ì«  '¦aý ̧  Ô”åÎpŽ!
Ð° Z Àø1⁄2  fJH3 4°Aáa2É°1⁄4¥j Äurwì]±§Áž×·F¡»ío91‹ –t»`g»•q•Ü' ́R: lþûa ̃3⁄4÷IÜïF o<· ûÿ ÛDa+8Øe‡  ̃XÖŽ«Q[Ñj· 8 ̃ ̄ ́¥Pra£  Œ‡ ü€à‹„Šï&–  Þ }  20ÁÙ >é± ̈ ÙÕJån¢yÆú§ ^h1 Åýž  ¢ ë ÅÁ-
 ö_‰4-ÀØ  Ü ¡K5Ë–†r1⁄2ñ  û(r‡¦Î  b2Â~Ü  ì”     s° äau†Ÿ^2TM É,Vf  Kp¦TMH›¿ oâ=ò ïÐ æHoŽGÇ£òÜàÏEëk2_TM|‡ d) mžâ~

 μ  2 ÑÙÅ8¥FvhÒœÒâÂZÎ Òâ eûrHÎÜnœTM<€ö¢‹  ̧åFGuk© ̧oNTMê‚ EèJÆòš(ZœŠ Kõpçåîë7 Û ̈ _< ̈- \_êLT:3’šE©Æ3⁄4 t " jû®£–¢.ÆN = ̄é‘t ̄gD×
aòÉz6 lÆ „1⁄4\   Åî(Ng'w’μ«,»7å` •f,û–+»ë1Y ́ž&ˆÐ íPÎ>+s»ÆþÆŸøuPVk¤¦éX10Z3⁄4ÇY £Þ×Á8 q 0r†Mód ¡r ́kÎN ƒž„ xZ_EÓà<ü )7  ́šG›üï" Àƒ.ß ̃?   M V[ [ Œy —Æ}«"‡PüTMî ÈÇl’&  
ç   ́ÚÔÐ]N tã$5ûël œÈÖ Ò×¤·Í~ëKUþËJž ÚîáÖs ̃Ü ̄ X¥aMãi‚ÞUŽ7 aL5ÛLSc0ûÉÙ§t&GäðcÐ8...  `NoƒÂ&Z6£QÉμ %jÝå A°Ë:ý^Ã 5L)Øæ0&Ò‐ dÐ:Ó¶- 6S §]  ̈aã0O¬¥ Y èr žïä+Iþ¬W^Ô ̄SŽæ„ƒ.ågFÏ©¡ãÁˆxÆvá  ̃J:g¡e2#é{/
Î¢iëä§x1⁄4Ô: Ÿ© ̈ˆ2  ‰ ›"‹Õ  'Fk<‰“  ŠH% ̈ýý`_y §Ó  ðRêâ xo+ ́ÿ äÂyîM& É 8{§©ÎÌf‹^Ñ I  š&:F ù...à   Bp6š Ï–‚ËŸ ‹Gi :— ã ́ç7Ò›$£ix‚é(Säá ÌÀÜ3⁄4¶qxø2
 ̄Zkw××;vâž2Æ>Q¤ïÑ8 (“a£s Ò ̃=%£à91⁄4üCôGîi ŒHó  ‡ñK$Vž ç|¤ pŠ+ T Ð< úÉ$ ® Ý|ÐÖ35ž  ́° -» 
        A«r
› 4ƒJs”„“Þy vh% e2GÏ`...ð„·äÈ‹ ¥ Y;</ ̈§nÔ X¢4=_
81 à ö ̄ Œ ̄€© -sÒk2 `ìœ`3⁄4x¤àæ”åØ@9Ø m  ̃ÊÚ1⁄4 Å b#q7A¿ 2‘...PÖã‘àÐ‰Ç|·ÃpnaaÓOQž  B [qoX- ê#5  •i1⁄2â Ëcp,ê Š(cb s1⁄4þÆ9\Má1⁄4Ã^ ïgb£ yÛ À-TM‹ a ̧rìöt tä‰ 7n}¿  òÇG‹  ‡õ JA¦Â‘Ì  0MÙäOÚ... w( 5žåÕàÞy ̃vùuw ]ìJ# Õ1⁄2 Ój»Ý“› \^‰h©c^]|  ̄Òý÷gÀË_ö 3~¤æDÅùâ -¿î1⁄46sÎƒŸμ1ri ¿ö&!<3⁄4%Ó? ¤Ép×ÄC Q ̃sŽàC7± Ük’Aß  ́° ¦àÃ#3z †Z¤ì*w<YÐ  ›«  'ÔqÒïÇLÜ9Q á‡” ~Ô\y@[y¤ò×«ÄìÄV‘77 -· ̃3d/Ót€„Yμ1⁄2¿õzçeciõñêr†:› o)
±Ž§Õ üE¿ùE¿\Ï£ØTM‡ñ #Øæ r x   WÚjÖ1⁄2ç É 2 `ÜA.“p ¤` &»ó "Â‹)ók„ ́d›äÄu# ŠîñPH%‹Ï×;V
“/k•š•ÆýæÒ "  Öì Æw  ...1⁄2+ úgÇ{vbýÃVž —h®Ü ̈Ð~) ˆ#O¡p†n9\ ÉùˆG\ 1⁄2ƒÍ¬*ŽÂôf3 1⁄2 `Ç}1⁄2ÿμJƒ »– 
”\–c·OQú[ IÑ•1ÉËËˆ®P Y8 ¶7°ŽÖ¤ß¶wÜ u ësPüTM±#s×?= Ú‚&gƒýW  ̈ÔøëÎ÷î-cN\oè+G&âFñó\ ̈kó€ŠS“rÌ1#P7\Gd]o AIZ ̈Ÿ2 QÃ1⁄4Ìjyý ̃o  ̈Ž  7+... v¤Tê9ð‚L`Ýœõî á •_Ýéùõ<...X– å(ÀŸõ†ýÀÛ )Û1⁄2Ø—   ́¥Ð,Û>fÒ=J’Aj_£Ö8ú ^ùß§&^?–í
ËaRšCß¥ S BoUü >ï¡W H E ̧ø~Ã‚T¦]k3⁄4[1⁄4<Z‘ô’Ùhê& ’ð(¤R É1äo’W:Häwô ̃Ä )Ù¤8   ( Ð »œ k  ° ¥ŽŠX °{¡2-¢|áÍà 
A&   ÏqÓ  Ðƒ ~Àj3ÖM sTM ±š ’c Z 0zmÚ  Šs•2®\g«+JÿáÈcÒˆ & Ÿçêt3⁄4 óaÓÉ_v yæ3⁄4ú VUëph ̄ÝÒúŠU>7gp2ÁYo f;Tæ 's@MN*·° ›g ó8; æx61W¬ FnÃÁÐÍμ1ì»ôUÌ Tò ?W¬±jBãHMdÍTyb `ø8 ÝäTÉÂl3 €båu3v†lÐ“_ÏmÅ ̄ëD ËÂ5j2~”—šâÃE•ýgƒþè ́vsˆ.Z ̃Er '  Cèw MœáTTMsAÍ«‚Ó ̃ ˆ;3:Ç Sn— ’‚ f ‚  }&ÚŽØÒ•hÝfï)ÿo,Â“Ö  ®ÏÚ õ39 ¶üm‰ AÄ î]×1 W] Ç ”‘9rÞð,k”9Ì‰ðàD}ñ ×M+Á«6Ä}
ÖoÖÍ1ÑÿÌ® ̃k9ò äÈ1 žN [ ^â){0&2Ekû±}eSwh ̈ŒaØÙ›„- aVÛK ̄ž#ŒI8Äƒ°w Ðe  Ýb2Ô q6äùs Ÿ +HÃðR5Zýêycμ1⁄2Ò^‚ýq 4 IŠŠ×ndY ̈`KÓTMoøk a~Ò›aÀwŽ¡ëZS  á UëÑã I/mÙI– |=‹ûÑƒÆƒCšÁ  ,&B0©5`  š‡\Vf ØïÝ 3hrE9Òyó£~1⁄4 Ÿ! ‚áGŠ&;EÞ WTMá1‹ýó  ÛmÿkÐrì [ÁS , dYd<lè¬ü Òätz ÷ÿ ŒJžI5 " LUy¶öái/TM– ́ÏÔ°¤äŒé‡ |¦ >öó  ‚ý®ñJ ç÷} ́1⁄2qJØO ̧Lo G£©SÈyÄ¥Fý“F:M&F ÊE3ÏMy¦...C zî+S‹ 1⁄2L û©)KáÖ3eí§\–n%}
§ óˆK¡HÔ)c=à 'Ñ ̈wî ±ŸH[œ&×iË~t1kœNÇae$   J?I§§±ZÇ4 õ‡À.a ̄öçq8 Ó”âŸË# ÝÞÀ+‰êSÒïâmW} 'q Sd   1⁄2xîá zHäÒ{èŽÐ” ‡~ug’Ç°g ¡O ë Pà~ £_Ë.p œ
9...h'æñ„.7¶s œ6•š ̄ ·"0?X§+aDtfqHKàT<á nTô3À-: É‹ μáxoê®Ñ t ý{uÿÕ¥ Ý}ýõFí*J«Í/k ... ö(YXjQ1k_c œùû*÷h±Ž† æ•‡åÖÍ»éd6B£
©:   Êñ äD-ô¦Jef&# 6 •’c ÝÔÊG¢R ̈ ̈ b ́ ¤VÁ†Fž1 ÄW•μÐðSã  f  `P{Û~ #þå?÷ >  ç nN/w^4^o1⁄2ÚagF Åâ7é‘8TMÃpûÑe•oR1Õ*4Åœëëú—õh % ́’b€æ•Ì DÈoZt¬iõ6•É: ÁlÝx ̈5 t ± ‰2=š/>áÀ ̄ G ç 1S( -SwWØF~1ž  ”1⁄2 ̄WÖbëòù)– U     ` ̃Ñ CÁxpnò×ppZw&  á(> & ö45  4Sê‡Ó ¤'UÔ  W§3 è `< 1⁄4 €| øø= ‚–  o1⁄2d_|BÖ  ê‡μÛû;Ï[2»;*òU 1⁄2 ‡@...žv ̃o þ~ZkP( U| íîˆÎŠ®‹d lPx‚ÖgbŒ  j“M æ÷PTçrù ̈æä q ̈a ¶ §T‚x [ÈŒ~ Ÿ ?s¥ÏêÈjÕ ûR  }€@mðL`¥Ïp2ÕZk¿  ÒžL ^‘1⁄2Ì øè û»Ä1GP—
ýò»ý ,Þ4é%ƒ 1ÖÂÉ_`pÆÑôÞ1⁄2{n   JAq íçTM ‡E1⁄4Ýv· ‡nÚf9ùHEý31⁄4Ø~1⁄4Ò  ”  ØèË9 Nj TM¢1⁄4(øŠZ ‹-vÞea%ÑÉxÚô„Û ̈ €9m ûÛJÓAc Âe(šF“ ́ ; ̧’— îV çYöIJybØ  ́ )Ç+I2 )ƒXßDÜ¿á•G§[f ¥Då:÷Ú®Ò®9ÐlÏ<G?
ˆFÎr Cμ ̧r•§ÏReμù ̈ <n ‡Ñ^l.ÓïUúý ~·Û hãI,YS ã‹(}v:ŽzñiÜÓÊB ̧à2 & „¦9€3⁄4*À1Ñ6ý^Ò % ÐðŒ’ ûQæ5 \zaW ›oW  Þé ŸƒÇðþ ̧1X3 μ é üz»ØX® ̄6 3⁄4ûÜn× ̧ Ú ®y É[ $ ^_Z ~±¬¶‚ ã¬ úêÏÈ‰±...  ah ̄oÈÁÂ^P _ MÐN5¦Ì   - û }H... ̧òf5éŠÐ ŽYÍu3(ötÒU ê È<1⁄2F ”+...ì–ŸœZx£
4+Ùd ƒiaçÉ( ¬§?#p* þ¢ Ò¥@ùV ÚN ...Ìô . €ahmà.Õ gÇÜ ž– VØr†Ä§. lnÐfÈYs7òFÆõm oû©’N ̄   ·ríƒF Œ ^Î‹

 ù›®gNr—°O1⁄4QþÄ«-À...ü}Rw°¡î ¤®§b< c i »V  H T¿f  õ$$£ ́ë?6œ  Åi—í¥– »ûòÍ•‐ “\;OD®=  ̧V¡œ x 8É£©-5 óÝ" {C  Ç F3 œ^;† T}~e»÷Sn@ÔÁ^hë%¶;I€ ŠÉR«dÒêýÂ¤•7 ÚXû‰iÒÓ   Äo?Â6OÓ. /o ° Ö%
€¬,»y&B6ŒO fÉ4Äì ” ~3 íÚŠÂ•1`  ÷Y[æÉ_††ß>Ž/ƒ ́7hÌÐo„TMOxzqqÑÀÏÁûÉÉa ¦w€,cÌ0Ú8 / 
ÏÉl3ûü¿„Cä R ?`Þ «ïL  §»E¶¡ŸF3!ìo–¡1cŸž‡°¤ÒÙ `£Õí Ïw /T89öU } †xv*x¿)ar3î®Ø3⁄4μz‹¡ÖçàD1⁄2 ̧[7oî ̄‹õ*óSB   mL IæÀ¬ ð‹O y•" z Óa !á?
7äKÒKÕg2 " kpíg./ NÕœÌeÅ ‚TMîå¥0óÔo7€4‚9 ̧ *Ñ }Dá ·' H ‡ ̄®oîÈõMKå ...TM7h‹ ùçó3 ́¶uM} Ê  }2Èe;   dí ®èö  ¢oÅ1ÒÀ§1‡Ž Ôd6‚žv
ýJšÜ;XÎQÛtåT ́ /*w°3Ô‡ 6
4©K6mi—LBoxf
éÇ”’§ñeWñHënŸYà.` @ Ž c Á s¤2lV +Å÷k\XcÁåÕÍs£Ù2ÖÅ ée ̃ôg  o Ô  ‡Þ ŒfŽKw¡HWjä\eùM]ßÅ  ÛáQ d¤öçÏðÙ ûT Ão'ÙÓ3ÍW1ó  ü÷ ûßêøM ÁÇš <À2
Ú ̃§œE]=L8CÅOÜ*¦9•¦:a‘2#`Ö,ò?sÎ  Êü?oNf£éì7É4?ÿÏÒòÒÒ’—ÿgyiõá ù þ!ù   nÊ¤± ¥8 Pû  @ÿL €úÑI Ž(  B„+ T ME‚Ü}óüÍë£7]8ˆ÷÷ Žð`ä£di‘ ÉÅ6‡Å^Z¢ ̄íGõÒõÚo Mè÷M 4#” ®ä íÏOàpS  Þ$E©G8TM¤8Nç®Bcó“Sçúçæ*1±§Îd $%TM+ TM ?Òö’B}  /¤  ̧ E  xâŸ>ýe± î   â>ì]e &ÞV ©I ,|Dû(tT  HöYU RRuJ_Oò+ ® ̃2  É3⁄4¦Ãq>GŠñμào
¬Nù4m uàô–  u6 ' ‹åÀ î72þó<S@ N$a£øÑÍÆ FÀ=Q  tμ À&ƒ61¢Ä'-n .
(Ònƒî9l¥o  @ÄÎo êD0çfj_zNí ì=bŒ7èý¤ß5±  ¬ æò&FäëVùÍ1⁄4ûiμ°_hÈ UŠiß÷a Ù*åuôbÒ5Nú1 μμ  s3⁄4ZÔ!¿û § ë "ã4=Î.|+s+·rŠ›.æc
šê ÛI‹Ýy( ̧£ 4@=-„•?»TÕ1 ˆ¢ 0o MÎ¢nl  ° Í·5r‡ ̈Ô Q  ̧La– P3⁄4>E'$àb%&î+ 3⁄4ŠéY†h‰O©a£Ë ̈gÅk ̈°ì 
WL$ ^m '«1⁄2©m‹Âñ ÿÑ^€ 2oH¶h=oÙ‘ë 3⁄4–È” @Aykÿèxôéx ìp¥#Uéxt<=þD¿éá èœîÛ >¿†ßøÏ ×Pμ€ÛÉzý 2}   4HîØ{x×àÍ 3 ,TM$(æ¡ Ü8 >¦sœ¶r"Ì  > Å ̃Qü£ gæ:h  >|aÂô „›á èp3TáÓ] ‚Îp »†žqté¬ÅÇÉ ̧UÄ á ÕˆãÔ 1⁄2 ...qE:_õFS`ç0
/Y Ÿ\ Þ æ¢q M (Ó° +x>Gz#μ\  Èl` ‘ 5N±U ̃Û÷$[®ä <•3⁄4«dZƒää O/à¥“ÁGv’¢ã.æôÄ2šñT»à7-?ÅpÔg1M—ë“ }î1Ì  ̈üB‡o”@o  €zr•tX P¡1...aí8C/+¥Ü ]~ ®Ï"Ðöàÿ°f|DÉNŽL‹¦d L%&l$2£Äb±x±“R ¶u/2 »ì®ÌsêË ƒ‹   TMÎ] [èçx©ZËSñ TM<“ICÕì:AŽà—I ’0Ê0ÅQœÛMúïxd={Ü¤ÿ2‡ŒÐ+çh + &ITP11Õ%Ò
ò ̃~—ƒN@q î Ú1⁄4 ̧Œ®pzsðÒhî~I¤TMÿ°1Gn $d|Ö€2€ —?‰ ÈŽ ¢BMp    ¢ƒ„ÓÏ ßêà–êh   ̄Òt ...W¬õB‚u ? Ò   ̧ /·Ö #¦•å•öb° Žt9œH)‹ ° (=-ÝH>› μ1⁄2K4 ,áT~û ¢   m< 'éÔrà¿ˆX  R¶*}J } aó á óùÄh°‡× +fúi<2YFh•Ö ñV1⁄4Âa@óÂàåz }a ̃Ê•ë  È1⁄4öW°·ûTMFz ̃ ! ž®ù3Ž? Ïéß»(fÁÜÊqW:a¦é 5;ÅÓÖ‹'=âøÑ2   Xá÷v<®“ÙpŒ> { žH ̈’æ ̄æâûÏ5#âoŒ#ýmü ÿI†‰ üýœž±μßÆé9o¿þ2Ÿ,± ̄6>YlŽ1⁄4Ô@;rï  F®ëV£§ ë ̃Gñ0Ôþ- êÙ`8Í< 'ãå3⁄4åûμb n
»ó€E9Î# m{ ...  ̄ò^ P í3⁄4ˆ>oß“^ã|: d ¢mQ±ƒ“ý ̈ñ ̧1 ̃÷ g&óÎñ,‚ÃTMž2 ÒR»ØAÍ~”... É 1⁄2öîêb•u«‚î©• &}â;–<‡*·“ÎÃ Záæ¿¡žæ1⁄2¶'G= WGXý ÜJ1⁄2—î¢8 ó °W&ç5úRêTM...3⁄4Î÷àj û{£×Ö ]‘æ ̈ƒ‐ 3œ10èÚYD^&f7×ï ̃1⁄2ã?·U ̧2 Ï1 '÷6  ̈«+gÍ ́ UöÓ|3ìŸg’ mû 3ì¬Yv3⁄4U¶‘À9– 3⁄4ÊÄ7N»Ò ßÄšŒsmøë ̈ƒ»Ñ4Zkžìa å ÌÛ ÿo ̈Œa Õ ÿo¿» ôïh©þ Îæo¬Åœ ̈μÊ±o‡K¤^k· L? ŸiAlƒo± I%BÒ‡›ðjŽ‚ð—š-+ÁÊ-í–1  ûmí–‹mŽ3¶ÆÀ•Ð‡6òr·26Î±2n  ́Í'„#vÆê£6.†ÏÊ3⁄4 ̃äìÊ†x ^4HÚ£‹9 ̄~ÂH°ô¦ÈÆ ̃
( ú\G ÔÑ4ß 3  ki)xJBkèóÃ
Júøó#}§¿ƒ 3J—fÃ°Íâ^øÆ1î ́é2<éŸÄ4 koç vó=øw0.3⁄4›yçm%\Ú23ñKL;çiñìà âjØM ̄†Œ¤  Ù¢Øs Êñ^ 6ÐÊ«^!  ËŠ~›ú ̄añ¬Êø ß*îËSÌ3⁄4‡5£È|_|ÊöëÚ  °0
'(÷Ü PHBÕ ˆwi3⁄4§ ̃:)ŽiÆäã(Ê ? kà‡ëÌýšRÆÐ±Ê›¡ÛK?Bë?
&ñ ̈  U€2 ./t›‹+eXŽ Ïe R3⁄4mHμæê2TCÀ< Ó3 ¡uÊ\bBóÒ—âÁ  §@ Î•ÑŠsÙ—| ÈÆÿP ä ìÈ<m  `Ò› ¢ýaöù;ÿÈ: ’3ä7kc3⁄4ýçââÒÃÕ?μ—ágéÑÃå¥å?-¶— — ÿ°ÿü]~‚àÿôvqmùáÚÊ¢Ørvá'+ ì–äÝgø  Ã§€þëa§Ÿ±@+  Ý ~ú ®› ,Û¢ XàsPe Ý |‚’ò =  Ç  ‹à§:} „ ò ́D1⁄2 þA"~“ýß81ø íÿ•Ìþ_YYúcÿÿ>ûÿŸ ×ÿ±ß  ̄ýß1⁄4 /ýþû õáòŸÚ++ Û VV Wpÿ/·W ý±ÿ — ýooû.ÿÈÇ lßcõa ÿaYxð 
Ì ̃Þ¶Žé îWØÿŸ¥  ð(I†1⁄4 m  Pü + =‚  ́ ̃Þ   á0μùŒôD  ›ü ̃n0U± „ }Æ @ ° E£°Õ öTMï$Ò  ž £Û„~ wëPë ̃é”¢RŸ»†31Å Œ§õOFÍ¬ýÿÛlþ[ìÿGËþþ_Z]]ücÿÿ ?Èý?Y!îÿ7¡ t»X– ÛÅÍ4Átg>u°ÁÞ†N ̧p‹)† ÷fÚáÁ-¤" Ü[Ð  nÑ 31⁄2†ÆÜþ–  ́wø"BÏ‚ßÄñóVû¿Ý^Åû¿3ÿÛ  WþØÿ¿§ÿ§Âƒ ÇO MòÐð ÇÏ;8~Þ¿ 1⁄4Þ;ÚéXmž‡ ̃â <¿Æ1jÅÐáŒ5“0õ-L  M ÏUÄr\ Š+Âù
†I ã ˆ£^© ́  *vj6=m<†  ̃í«ÍÁXK*ÏÄÞ!çš° Ã’g  k ÷ ́;ƒ©Á3⁄4ØÃñ o w‚£ov ƒW{/Þ1⁄4Ü ^ì ìl 1⁄2ü3⁄4Træ6F )± ̃>Ñ)aÐÒW°Ž4P ä'Fû Š%KeÑgu6„a"ÈF1ô• 3@†’CôjíE8

 h
 ¤ì‘/×MÇ7ÑÓ –wpÅá aî1 üþÞ  –Gá|UaZüÃãOX/1wÈñ›ÐÜ Ã  ÑÅë -fØ{  'P3ÙÔ3óÕ›×ÛG»{ ̄Õ|- 
 ̈dNP« pa ñûQr  âa?Á¤1⁄4¥Ò>å  ìDlÐ.¥ B/ Õ òDh– § r ̈Âœu t• ^ZàÛ ;=–  â$  Hp   •àïÉ, ôƒ Px£7›úÎÂ[Ûßìt¿Ú...åUê...
Í l'‰ê¡éUÚâf {‡åμ" Ýí7‡G{ ̄ ‚  s*ö€&' ̃»  Röt}2 ‹òd#è¢ G•èRûUÇFØ ŽOõg[) ̄Ó qö*•øÑu Î  ́È...»R ̧Zóœs]ÈIê@μ  ‹3⁄4 2Ð, hÈÇ ̧ ¶îvWŠ{‘¤Ù XVP1⁄4Ì RDŒ hTMá//3©  ́sfD¢9i X7 ̧3⁄4 4{Âúqd¥ 3Þ fß(D®2ÜNðEZg|”   ?R ø±vŒ1C¤'A« T*a?æ QEõ ûFß‚Ü(;0° ¿ïÕo  ) ̈d £1î¤úE2ž¦°a·ñ ›TÌÙ
dLQaB •  k ¶3¥Å4Ij%ñ
Ä jkÖ—@J’a a’yƒ’›4uÀØ+pÇl{ ñ+2;m-ÿ±Ú• ž  | âF ̄3Vx2 1Û ̄T:@Ê‹ãCwê8TM¡¥01⁄4ê3  ̃D ž7[öðrÚPŽå”“†-Xà=1⁄2RNÐöXK:qùETÁ¬ÕÜ 65á`ÐdËó# ÙÌÈOÃ$ „g ̈C4...&û€ ù1⁄2ä7[{ûä  «ñD  4 PÚV<—s  J”M–ëÄõBÁñŸ@TM§v@ Ó€ ̄ðf a
û_-{„©\£Î[Yl z–WÓ¥Pa¶„c ç'<Æ’S; õÃ: ...}ÿMÒS Å Ób§1⁄2} Æ <’å1⁄4?
% <ÑEK3Êÿ TM/` á€1¡ yžTätÖïG  ~ÂÙ°0...ï= ; ®®éGT Ù•ÄHUgJØ*ÏFŽõ oÒré
GÌo  nÕ5&Ts ¡–»Ñ41⁄2G 'sàc©À[ÚÜ1⁄2¤fð“ç.
 ̄Ð¥°1⁄4Ž¦ >Žn¡‡6 v‹¢SÒ{ ̄¤$"&£N°p Ü ó &àáø7ZôÕ   ãx¿ ¬s¿6}ä Pï£+„@æ¥5ÊuJAü?LZÇé— 
ð ̄Ug0”ûÀà· ÷¦Š Ö3 ŠLwœ6  ́ZùïÊÇ? 1⁄2ú{1ÕòCóÝSG â ô CŽ”w_”3Ö"aÜF¦gŽ“¥•y3 ~»sp üf7  ̧” ¿5ð<Èù`saf\m Ca&C=‘Æ¬ ̄]•ÞðÚøÉ zjÊ(ãÑñ ¢Q2;;oZˆVÌøXxÒlepÐs ̈ã  ̄éX&Êè0D‡á!¦®Ÿ
•    }i›t =‡ ‚}„ L /  “_[‘ 3cÍ ó3Ö 5  'à Ôxé3Œ ?Ï ·1⁄2-43μa  ́_ wμ¡[Tì–“#Eó]oœfÄ   ù°»°`ù\ø
4Ñc«3tÑ —¡ 1⁄2‰O 1⁄2Sð úè–Î¥‘Úš\Ñ=jSòÒ ÉÂw 5•iÃμμbŽü1⁄2z|ñ ÖŠ% ̄&+ƒž®à¿aL`Î8‐ ¢<“œ3⁄4 ‡v o)Óü§ã“êÛÅÆ“w jÇÍì§k7–¡Øˆ |ö[1 t'<R1d~V Ï b!»xMZh1⁄2 ̧ö3Ð÷ŸËÄMhúoÚÆMúŸv{Ù‹ÿ·øpé û ßåGå,:è &l|„ Y], ì|»KßÛárÔ>y ́ô ̧ÿdùñééÉbûñ“'Ë  G'í~ ̄ß øxe%ZZŽžüa¥ñÇÏ ? üüñóÇÏ ? üüñóÇÏ ? 
üüñóÏüóÿ [ÃÇ p 

- <code><a href="./src/resources/accounts/accounts.ts">Account</a></code>
- <code><a href="./src/resources/accounts/accounts.ts">AccountUpdateResponse</a></code>
- <code><a href="./src/resources/accounts/accounts.ts">AccountListResponse</a></code>
- <code><a href="./src/resources/accounts/accounts.ts">AccountGetResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}">client.accounts.<a href="./src/resources/accounts/accounts.ts">update</a>({ ...params }) -> AccountUpdateResponse</code>
- <code title="get /accounts">client.accounts.<a href="./src/resources/accounts/accounts.ts">list</a>({ ...params }) -> AccountListResponsesV4PagePaginationArray</code>
- <code title="get /accounts/{account_id}">client.accounts.<a href="./src/resources/accounts/accounts.ts">get</a>({ ...params }) -> AccountGetResponse</code>

## Members

Types:

- <code><a href="./src/resources/accounts/members.ts">Status</a></code>
- <code><a href="./src/resources/accounts/members.ts">UserWithInviteCode</a></code>
- <code><a href="./src/resources/accounts/members.ts">MemberCreateResponse</a></code>
- <code><a href="./src/resources/accounts/members.ts">MemberUpdateResponse</a></code>
- <code><a href="./src/resources/accounts/members.ts">MemberListResponse</a></code>
- <code><a href="./src/resources/accounts/members.ts">MemberDeleteResponse</a></code>
- <code><a href="./src/resources/accounts/members.ts">MemberGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/members">client.accounts.members.<a href="./src/resources/accounts/members.ts">create</a>({ ...params }) -> MemberCreateResponse</code>
- <code title="put /accounts/{account_id}/members/{member_id}">client.accounts.members.<a href="./src/resources/accounts/members.ts">update</a>(memberId, { ...params }) -> MemberUpdateResponse</code>
- <code title="get /accounts/{account_id}/members">client.accounts.members.<a href="./src/resources/accounts/members.ts">list</a>({ ...params }) -> MemberListResponsesV4PagePaginationArray</code>
- <code title="delete /accounts/{account_id}/members/{member_id}">client.accounts.members.<a href="./src/resources/accounts/members.ts">delete</a>(memberId, { ...params }) -> MemberDeleteResponse | null</code>
- <code title="get /accounts/{account_id}/members/{member_id}">client.accounts.members.<a href="./src/resources/accounts/members.ts">get</a>(memberId, { ...params }) -> MemberGetResponse</code>

## Roles

Types:

- <code><a href="./src/resources/accounts/roles.ts">RoleGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/roles">client.accounts.roles.<a href="./src/resources/accounts/roles.ts">list</a>({ ...params }) -> RolesSinglePage</code>
- <code title="get /accounts/{account_id}/roles/{role_id}">client.accounts.roles.<a href="./src/resources/accounts/roles.ts">get</a>(roleId, { ...params }) -> RoleGetResponse</code>

# OriginCACertificates

Types:

- <code><a href="./src/resources/origin-ca-certificates.ts">OriginCACertificate</a></code>
- <code><a href="./src/resources/origin-ca-certificates.ts">OriginCACertificateCreateResponse</a></code>
- <code><a href="./src/resources/origin-ca-certificates.ts">OriginCACertificateDeleteResponse</a></code>
- <code><a href="./src/resources/origin-ca-certificates.ts">OriginCACertificateGetResponse</a></code>

Methods:

- <code title="post /certificates">client.originCACertificates.<a href="./src/resources/origin-ca-certificates.ts">create</a>({ ...params }) -> OriginCACertificateCreateResponse</code>
- <code title="get /certificates">client.originCACertificates.<a href="./src/resources/origin-ca-certificates.ts">list</a>({ ...params }) -> OriginCACertificatesSinglePage</code>
- <code title="delete /certificates/{certificate_id}">client.originCACertificates.<a href="./src/resources/origin-ca-certificates.ts">delete</a>(certificateId) -> OriginCACertificateDeleteResponse</code>
- <code title="get /certificates/{certificate_id}">client.originCACertificates.<a href="./src/resources/origin-ca-certificates.ts">get</a>(certificateId) -> OriginCACertificateGetResponse</code>

# IPs

Types:

- <code><a href="./src/resources/ips.ts">IPs</a></code>
- <code><a href="./src/resources/ips.ts">JDCloudIPs</a></code>
- <code><a href="./src/resources/ips.ts">IPListResponse</a></code>

Methods:

- <code title="get /ips">client.ips.<a href="./src/resources/ips.ts">list</a>({ ...params }) -> IPListResponse</code>

# Memberships

Types:

- <code><a href="./src/resources/memberships.ts">Membership</a></code>
- <code><a href="./src/resources/memberships.ts">MembershipUpdateResponse</a></code>
- <code><a href="./src/resources/memberships.ts">MembershipDeleteResponse</a></code>
- <code><a href="./src/resources/memberships.ts">MembershipGetResponse</a></code>

Methods:

- <code title="put /memberships/{membership_id}">client.memberships.<a href="./src/resources/memberships.ts">update</a>(membershipId, { ...params }) -> MembershipUpdateResponse</code>
- <code title="get /memberships">client.memberships.<a href="./src/resources/memberships.ts">list</a>({ ...params }) -> MembershipsV4PagePaginationArray</code>
- <code title="delete /memberships/{membership_id}">client.memberships.<a href="./src/resources/memberships.ts">delete</a>(membershipId) -> MembershipDeleteResponse</code>
- <code title="get /memberships/{membership_id}">client.memberships.<a href="./src/resources/memberships.ts">get</a>(membershipId) -> MembershipGetResponse</code>

# User

Types:

- <code><a href="./src/resources/user/user.ts">UserEditResponse</a></code>
- <code><a href="./src/resources/user/user.ts">UserGetResponse</a></code>

Methods:

- <code title="patch /user">client.user.<a href="./src/resources/user/user.ts">edit</a>({ ...params }) -> UserEditResponse</code>
- <code title="get /user">client.user.<a href="./src/resources/user/user.ts">get</a>() -> UserGetResponse</code>

## AuditLogs

Methods:

- <code title="get /user/audit_logs">client.user.auditLogs.<a href="./src/resources/user/audit-logs.ts">list</a>({ ...params }) -> AuditLogsV4PagePaginationArray</code>

## Billing

### History

Types:

- <code><a href="./src/resources/user/billing/history.ts">BillingHistory</a></code>

Methods:

- <code title="get /user/billing/history">client.user.billing.history.<a href="./src/resources/user/billing/history.ts">list</a>({ ...params }) -> BillingHistoriesV4PagePaginationArray</code>

### Profile

Types:

- <code><a href="./src/resources/user/billing/profile.ts">ProfileGetResponse</a></code>

Methods:

- <code title="get /user/billing/profile">client.user.billing.profile.<a href="./src/resources/user/billing/profile.ts">get</a>() -> ProfileGetResponse</code>

## Invites

Types:

- <code><a href="./src/resources/user/invites.ts">Invite</a></code>
- <code><a href="./src/resources/user/invites.ts">InviteEditResponse</a></code>
- <code><a href="./src/resources/user/invites.ts">InviteGetResponse</a></code>

Methods:

- <code title="get /user/invites">client.user.invites.<a href="./src/resources/user/invites.ts">list</a>() -> InvitesSinglePage</code>
- <code title="patch /user/invites/{invite_id}">client.user.invites.<a href="./src/resources/user/invites.ts">edit</a>(inviteId, { ...params }) -> InviteEditResponse</code>
- <code title="get /user/invites/{invite_id}">client.user.invites.<a href="./src/resources/user/invites.ts">get</a>(inviteId) -> InviteGetResponse</code>

## Organizations

Types:

- <code><a href="./src/resources/user/organizations.ts">Organization</a></code>
- <code><a href="./src/resources/user/organizations.ts">OrganizationDeleteResponse</a></code>
- <code><a href="./src/resources/user/organizations.ts">OrganizationGetResponse</a></code>

Methods:

- <code title="get /user/organizations">client.user.organizations.<a href="./src/resources/user/organizations.ts">list</a>({ ...params }) -> OrganizationsV4PagePaginationArray</code>
- <code title="delete /user/organizations/{organization_id}">client.user.organizations.<a href="./src/resources/user/organizations.ts">delete</a>(organizationId) -> OrganizationDeleteResponse</code>
- <code title="get /user/organizations/{organization_id}">client.user.organizations.<a href="./src/resources/user/organizations.ts">get</a>(organizationId) -> OrganizationGetResponse</code>

## Subscriptions

Types:

- <code><a href="./src/resources/user/subscriptions.ts">RatePlan</a></code>
- <code><a href="./src/resources/user/subscriptions.ts">Subscription</a></code>
- <code><a href="./src/resources/user/subscriptions.ts">SubscriptionComponent</a></code>
- <code><a href="./src/resources/user/subscriptions.ts">SubscriptionZone</a></code>
- <code><a href="./src/resources/user/subscriptions.ts">SubscriptionUpdateResponse</a></code>
- <code><a href="./src/resources/user/subscriptions.ts">SubscriptionDeleteResponse</a></code>
- <code><a href="./src/resources/user/subscriptions.ts">SubscriptionEditResponse</a></code>
- <code><a href="./src/resources/user/subscriptions.ts">SubscriptionGetResponse</a></code>

Methods:

- <code title="put /user/subscriptions/{identifier}">client.user.subscriptions.<a href="./src/resources/user/subscriptions.ts">update</a>(identifier, { ...params }) -> SubscriptionUpdateResponse</code>
- <code title="delete /user/subscriptions/{identifier}">client.user.subscriptions.<a href="./src/resources/user/subscriptions.ts">delete</a>(identifier) -> SubscriptionDeleteResponse</code>
- <code title="put /zones/{identifier}/subscription">client.user.subscriptions.<a href="./src/resources/user/subscriptions.ts">edit</a>(identifier, { ...params }) -> SubscriptionEditResponse</code>
- <code title="get /user/subscriptions">client.user.subscriptions.<a href="./src/resources/user/subscriptions.ts">get</a>() -> SubscriptionGetResponse | null</code>

## Tokens

Types:

- <code><a href="./src/resources/user/tokens/tokens.ts">CIDRList</a></code>
- <code><a href="./src/resources/user/tokens/tokens.ts">Policy</a></code>
- <code><a href="./src/resources/user/tokens/tokens.ts">Token</a></code>
- <code><a href="./src/resources/user/tokens/tokens.ts">TokenCreateResponse</a></code>
- <code><a href="./src/resources/user/tokens/tokens.ts">TokenUpdateResponse</a></code>
- <code><a href="./src/resources/user/tokens/tokens.ts">TokenListResponse</a></code>
- <code><a href="./src/resources/user/tokens/tokens.ts">TokenDeleteResponse</a></code>
- <code><a href="./src/resources/user/tokens/tokens.ts">TokenGetResponse</a></code>
- <code><a href="./src/resources/user/tokens/tokens.ts">TokenVerifyResponse</a></code>

Methods:

- <code title="post /user/tokens">client.user.tokens.<a href="./src/resources/user/tokens/tokens.ts">create</a>({ ...params }) -> TokenCreateResponse</code>
- <code title="put /user/tokens/{token_id}">client.user.tokens.<a href="./src/resources/user/tokens/tokens.ts">update</a>(tokenId, { ...params }) -> TokenUpdateResponse</code>
- <code title="get /user/tokens">client.user.tokens.<a href="./src/resources/user/tokens/tokens.ts">list</a>({ ...params }) -> TokenListResponsesV4PagePaginationArray</code>
- <code title="delete /user/tokens/{token_id}">client.user.tokens.<a href="./src/resources/user/tokens/tokens.ts">delete</a>(tokenId) -> TokenDeleteResponse | null</code>
- <code title="get /user/tokens/{token_id}">client.user.tokens.<a href="./src/resources/user/tokens/tokens.ts">get</a>(tokenId) -> TokenGetResponse</code>
- <code title="get /user/tokens/verify">client.user.tokens.<a href="./src/resources/user/tokens/tokens.ts">verify</a>() -> TokenVerifyResponse</code>

### PermissionGroups

Types:

- <code><a href="./src/resources/user/tokens/permission-groups.ts">PermissionGroupListResponse</a></code>

Methods:

- <code title="get /user/tokens/permission_groups">client.user.tokens.permissionGroups.<a href="./src/resources/user/tokens/permission-groups.ts">list</a>() -> PermissionGroupListResponsesSinglePage</code>

### Value

Types:

- <code><a href="./src/resources/user/tokens/value.ts">Value</a></code>

Methods:

- <code title="put /user/tokens/{token_id}/value">client.user.tokens.value.<a href="./src/resources/user/tokens/value.ts">update</a>(tokenId, { ...params }) -> Value</code>

# Zones

Types:

- <code><a href="./src/resources/zones/zones.ts">Type</a></code>
- <code><a href="./src/resources/zones/zones.ts">Zone</a></code>
- <code><a href="./src/resources/zones/zones.ts">ZoneDeleteResponse</a></code>

Methods:

- <code title="post /zones">client.zones.<a href="./src/resources/zones/zones.ts">create</a>({ ...params }) -> Zone</code>
- <code title="get /zones">client.zones.<a href="./src/resources/zones/zones.ts">list</a>({ ...params }) -> ZonesV4PagePaginationArray</code>
- <code title="delete /zones/{zone_id}">client.zones.<a href="./src/resources/zones/zones.ts">delete</a>({ ...params }) -> ZoneDeleteResponse | null</code>
- <code title="patch /zones/{zone_id}">client.zones.<a href="./src/resources/zones/zones.ts">edit</a>({ ...params }) -> Zone</code>
- <code title="get /zones/{zone_id}">client.zones.<a href="./src/resources/zones/zones.ts">get</a>({ ...params }) -> Zone</code>

## ActivationCheck

Types:

- <code><a href="./src/resources/zones/activation-check.ts">ActivationCheckTriggerResponse</a></code>

Methods:

- <code title="put /zones/{zone_id}/activation_check">client.zones.activationCheck.<a href="./src/resources/zones/activation-check.ts">trigger</a>({ ...params }) -> ActivationCheckTriggerResponse</code>

## Settings

Types:

- <code><a href="./src/resources/zones/settings.ts">AdvancedDDoS</a></code>
- <code><a href="./src/resources/zones/settings.ts">AlwaysOnline</a></code>
- <code><a href="./src/resources/zones/settings.ts">AlwaysUseHTTPS</a></code>
- <code><a href="./src/resources/zones/settings.ts">AutomaticHTTPSRewrites</a></code>
- <code><a href="./src/resources/zones/settings.ts">AutomaticPlatformOptimization</a></code>
- <code><a href="./src/resources/zones/settings.ts">Brotli</a></code>
- <code><a href="./src/resources/zones/settings.ts">BrowserCacheTTL</a></code>
- <code><a href="./src/resources/zones/settings.ts">BrowserCheck</a></code>
- <code><a href="./src/resources/zones/settings.ts">CacheLevel</a></code>
- <code><a href="./src/resources/zones/settings.ts">ChallengeTTL</a></code>
- <code><a href="./src/resources/zones/settings.ts">Ciphers</a></code>
- <code><a href="./src/resources/zones/settings.ts">DevelopmentMode</a></code>
- <code><a href="./src/resources/zones/settings.ts">EarlyHints</a></code>
- <code><a href="./src/resources/zones/settings.ts">EmailObfuscation</a></code>
- <code><a href="./src/resources/zones/settings.ts">FontSettings</a></code>
- <code><a href="./src/resources/zones/settings.ts">H2Prioritization</a></code>
- <code><a href="./src/resources/zones/settings.ts">HotlinkProtection</a></code>
- <code><a href="./src/resources/zones/settings.ts">HTTP2</a></code>
- <code><a href="./src/resources/zones/settings.ts">HTTP3</a></code>
- <code><a href="./src/resources/zones/settings.ts">ImageResizing</a></code>
- <code><a href="./src/resources/zones/settings.ts">IPGeolocation</a></code>
- <code><a href="./src/resources/zones/settings.ts">IPV6</a></code>
- <code><a href="./src/resources/zones/settings.ts">MinTLSVersion</a></code>
- <code><a href="./src/resources/zones/settings.ts">Minify</a></code>
- <code><a href="./src/resources/zones/settings.ts">Mirage</a></code>
- <code><a href="./src/resources/zones/settings.ts">MobileRedirect</a></code>
- <code><a href="./src/resources/zones/settings.ts">NEL</a></code>
- <code><a href="./src/resources/zones/settings.ts">OpportunisticEncryption</a></code>
- <code><a href="./src/resources/zones/settings.ts">OpportunisticOnion</a></code>
- <code><a href="./src/resources/zones/settings.ts">OrangeToOrange</a></code>
- <code><a href="./src/resources/zones/settings.ts">OriginErrorPagePassThru</a></code>
- <code><a href="./src/resources/zones/settings.ts">OriginMaxHTTPVersion</a></code>
- <code><a href="./src/resources/zones/settings.ts">Polish</a></code>
- <code><a href="./src/resources/zones/settings.ts">PrefetchPreload</a></code>
- <code><a href="./src/resources/zones/settings.ts">ProxyReadTimeout</a></code>
- <code><a href="./src/resources/zones/settings.ts">PseudoIPV4</a></code>
- <code><a href="./src/resources/zones/settings.ts">ResponseBuffering</a></code>
- <code><a href="./src/resources/zones/settings.ts">RocketLoader</a></code>
- <code><a href="./src/resources/zones/settings.ts">SecurityHeaders</a></code>
- <code><a href="./src/resources/zones/settings.ts">SecurityLevel</a></code>
- <code><a href="./src/resources/zones/settings.ts">ServerSideExcludes</a></code>
- <code><a href="./src/resources/zones/settings.ts">SortQueryStringForCache</a></code>
- <code><a href="./src/resources/zones/settings.ts">SSL</a></code>
- <code><a href="./src/resources/zones/settings.ts">SSLRecommender</a></code>
- <code><a href="./src/resources/zones/settings.ts">TLS1_3</a></code>
- <code><a href="./src/resources/zones/settings.ts">TLSClientAuth</a></code>
- <code><a href="./src/resources/zones/settings.ts">TrueClientIPHeader</a></code>
- <code><a href="./src/resources/zones/settings.ts">WAF</a></code>
- <code><a href="./src/resources/zones/settings.ts">WebP</a></code>
- <code><a href="./src/resources/zones/settings.ts">Websocket</a></code>
- <code><a href="./src/resources/zones/settings.ts">ZeroRTT</a></code>
- <code><a href="./src/resources/zones/settings.ts">SettingEditResponse</a></code>
- <code><a href="./src/resources/zones/settings.ts">SettingGetResponse</a></code>

Methods:

- <code title="patch /zones/{zone_id}/settings/{setting_id}">client.zones.settings.<a href="./src/resources/zones/settings.ts">edit</a>(settingId, { ...params }) -> SettingEditResponse</code>
- <code title="get /zones/{zone_id}/settings/{setting_id}">client.zones.settings.<a href="./src/resources/zones/settings.ts">get</a>(settingId, { ...params }) -> SettingGetResponse</code>

## CustomNameservers

Types:

- <code><a href="./src/resources/zones/custom-nameservers.ts">CustomNameserverUpdateResponse</a></code>
- <code><a href="./src/resources/zones/custom-nameservers.ts">CustomNameserverGetResponse</a></code>

Methods:

- <code title="put /zones/{zone_id}/custom_ns">client.zones.customNameservers.<a href="./src/resources/zones/custom-nameservers.ts">update</a>({ ...params }) -> CustomNameserverUpdateResponse | null</code>
- <code title="get /zones/{zone_id}/custom_ns">client.zones.customNameservers.<a href="./src/resources/zones/custom-nameservers.ts">get</a>({ ...params }) -> CustomNameserverGetResponse | null</code>

## Holds

Types:

- <code><a href="./src/resources/zones/holds.ts">ZoneHold</a></code>

Methods:

- <code title="post /zones/{zone_id}/hold">client.zones.holds.<a href="./src/resources/zones/holds.ts">create</a>({ ...params }) -> ZoneHold</code>
- <code title="delete /zones/{zone_id}/hold">client.zones.holds.<a href="./src/resources/zones/holds.ts">delete</a>({ ...params }) -> ZoneHold</code>
- <code title="get /zones/{zone_id}/hold">client.zones.holds.<a href="./src/resources/zones/holds.ts">get</a>({ ...params }) -> ZoneHold</code>

## Subscriptions

Types:

- <code><a href="./src/resources/zones/subscriptions.ts">SubscriptionCreateResponse</a></code>
- <code><a href="./src/resources/zones/subscriptions.ts">SubscriptionGetResponse</a></code>

Methods:

- <code title="post /zones/{identifier}/subscription">client.zones.subscriptions.<a href="./src/resources/zones/subscriptions.ts">create</a>(identifier, { ...params }) -> SubscriptionCreateResponse</code>
- <code title="get /accounts/{account_identifier}/subscriptions">client.zones.subscriptions.<a href="./src/resources/zones/subscriptions.ts">list</a>(accountIdentifier) -> SubscriptionsSinglePage</code>
- <code title="get /zones/{identifier}/subscription">client.zones.subscriptions.<a href="./src/resources/zones/subscriptions.ts">get</a>(identifier) -> SubscriptionGetResponse</code>

# LoadBalancers

Types:

- <code><a href="./src/resources/load-balancers/load-balancers.ts">AdaptiveRouting</a></code>
- <code><a href="./src/resources/load-balancers/load-balancers.ts">CheckRegion</a></code>
- <code><a href="./src/resources/load-balancers/load-balancers.ts">DefaultPools</a></code>
- <code><a href="./src/resources/load-balancers/load-balancers.ts">FilterOptions</a></code>
- <code><a href="./src/resources/load-balancers/load-balancers.ts">Header</a></code>
- <code><a href="./src/resources/load-balancers/load-balancers.ts">Host</a></code>
- <code><a href="./src/resources/load-balancers/load-balancers.ts">LoadBalancer</a></code>
- <code><a href="./src/resources/load-balancers/load-balancers.ts">LoadShedding</a></code>
- <code><a href="./src/resources/load-balancers/load-balancers.ts">LocationStrategy</a></code>
- <code><a href="./src/resources/load-balancers/load-balancers.ts">NotificationFilter</a></code>
- <code><a href="./src/resources/load-balancers/load-balancers.ts">Origin</a></code>
- <code><a href="./src/resources/load-balancers/load-balancers.ts">OriginSteering</a></code>
- <code><a href="./src/resources/load-balancers/load-balancers.ts">RandomSteering</a></code>
- <code><a href="./src/resources/load-balancers/load-balancers.ts">Rules</a></code>
- <code><a href="./src/resources/load-balancers/load-balancers.ts">SessionAffinity</a></code>
- <code><a href="./src/resources/load-balancers/load-balancers.ts">SessionAffinityAttributes</a></code>
- <code><a href="./src/resources/load-balancers/load-balancers.ts">SteeringPolicy</a></code>
- <code><a href="./src/resources/load-balancers/load-balancers.ts">LoadBalancerDeleteResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/load_balancers">client.loadBalancers.<a href="./src/resources/load-balancers/load-balancers.ts">create</a>({ ...params }) -> LoadBalancer</code>
- <code title="put /zones/{zone_id}/load_balancers/{load_balancer_id}">client.loadBalancers.<a href="./src/resources/load-balancers/load-balancers.ts">update</a>(loadBalancerId, { ...params }) -> LoadBalancer</code>
- <code title="get /zones/{zone_id}/load_balancers">client.loadBalancers.<a href="./src/resources/load-balancers/load-balancers.ts">list</a>({ ...params }) -> LoadBalancersSinglePage</code>
- <code title="delete /zones/{zone_id}/load_balancers/{load_balancer_id}">client.loadBalancers.<a href="./src/resources/load-balancers/load-balancers.ts">delete</a>(loadBalancerId, { ...params }) -> LoadBalancerDeleteResponse</code>
- <code title="patch /zones/{zone_id}/load_balancers/{load_balancer_id}">client.loadBalancers.<a href="./src/resources/load-balancers/load-balancers.ts">edit</a>(loadBalancerId, { ...params }) -> LoadBalancer</code>
- <code title="get /zones/{zone_id}/load_balancers/{load_balancer_id}">client.loadBalancers.<a href="./src/resources/load-balancers/load-balancers.ts">get</a>(loadBalancerId, { ...params }) -> LoadBalancer</code>

## Monitors

Types:

- <code><a href="./src/resources/load-balancers/monitors/monitors.ts">Monitor</a></code>
- <code><a href="./src/resources/load-balancers/monitors/monitors.ts">MonitorDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/load_balancers/monitors">client.loadBalancers.monitors.<a href="./src/resources/load-balancers/monitors/monitors.ts">create</a>({ ...params }) -> Monitor</code>
- <code title="put /accounts/{account_id}/load_balancers/monitors/{monitor_id}">client.loadBalancers.monitors.<a href="./src/resources/load-balancers/monitors/monitors.ts">update</a>(monitorId, { ...params }) -> Monitor</code>
- <code title="get /accounts/{account_id}/load_balancers/monitors">client.loadBalancers.monitors.<a href="./src/resources/load-balancers/monitors/monitors.ts">list</a>({ ...params }) -> MonitorsSinglePage</code>
- <code title="delete /accounts/{account_id}/load_balancers/monitors/{monitor_id}">client.loadBalancers.monitors.<a href="./src/resources/load-balancers/monitors/monitors.ts">delete</a>(monitorId, { ...params }) -> MonitorDeleteResponse</code>
- <code title="patch /accounts/{account_id}/load_balancers/monitors/{monitor_id}">client.loadBalancers.monitors.<a href="./src/resources/load-balancers/monitors/monitors.ts">edit</a>(monitorId, { ...params }) -> Monitor</code>
- <code title="get /accounts/{account_id}/load_balancers/monitors/{monitor_id}">client.loadBalancers.monitors.<a href="./src/resources/load-balancers/monitors/monitors.ts">get</a>(monitorId, { ...params }) -> Monitor</code>

### Previews

Types:

- <code><a href="./src/resources/load-balancers/monitors/previews.ts">PreviewCreateResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/load_balancers/monitors/{monitor_id}/preview">client.loadBalancers.monitors.previews.<a href="./src/resources/load-balancers/monitors/previews.ts">create</a>(monitorId, { ...params }) -> PreviewCreateResponse</code>

### References

Types:

- <code><a href="./src/resources/load-balancers/monitors/references.ts">ReferenceGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/load_balancers/monitors/{monitor_id}/references">client.loadBalancers.monitors.references.<a href="./src/resources/load-balancers/monitors/references.ts">get</a>(monitorId, { ...params }) -> ReferenceGetResponse | null</code>

## Pools

Types:

- <code><a href="./src/resources/load-balancers/pools/pools.ts">Pool</a></code>
- <code><a href="./src/resources/load-balancers/pools/pools.ts">PoolDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/load_balancers/pools">client.loadBalancers.pools.<a href="./src/resources/load-balancers/pools/pools.ts">create</a>({ ...params }) -> Pool</code>
- <code title="put /accounts/{account_id}/load_balancers/pools/{pool_id}">client.loadBalancers.pools.<a href="./src/resources/load-balancers/pools/pools.ts">update</a>(poolId, { ...params }) -> Pool</code>
- <code title="get /accounts/{account_id}/load_balancers/pools">client.loadBalancers.pools.<a href="./src/resources/load-balancers/pools/pools.ts">list</a>({ ...params }) -> PoolsSinglePage</code>
- <code title="delete /accounts/{account_id}/load_balancers/pools/{pool_id}">client.loadBalancers.pools.<a href="./src/resources/load-balancers/pools/pools.ts">delete</a>(poolId, { ...params }) -> PoolDeleteResponse</code>
- <code title="patch /accounts/{account_id}/load_balancers/pools/{pool_id}">client.loadBalancers.pools.<a href="./src/resources/load-balancers/pools/pools.ts">edit</a>(poolId, { ...params }) -> Pool</code>
- <code title="get /accounts/{account_id}/load_balancers/pools/{pool_id}">client.loadBalancers.pools.<a href="./src/resources/load-balancers/pools/pools.ts">get</a>(poolId, { ...params }) -> Pool</code>

### Health

Types:

- <code><a href="./src/resources/load-balancers/pools/health.ts">HealthCreateResponse</a></code>
- <code><a href="./src/resources/load-balancers/pools/health.ts">HealthGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/load_balancers/pools/{pool_id}/preview">client.loadBalancers.pools.health.<a href="./src/resources/load-balancers/pools/health.ts">create</a>(poolId, { ...params }) -> HealthCreateResponse</code>
- <code title="get /accounts/{account_id}/load_balancers/pools/{pool_id}/health">client.loadBalancers.pools.health.<a href="./src/resources/load-balancers/pools/health.ts">get</a>(poolId, { ...params }) -> HealthGetResponse</code>

### References

Types:

- <code><a href="./src/resources/load-balancers/pools/references.ts">ReferenceGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/load_balancers/pools/{pool_id}/references">client.loadBalancers.pools.references.<a href="./src/resources/load-balancers/pools/references.ts">get</a>(poolId, { ...params }) -> ReferenceGetResponse | null</code>

## Previews

Types:

- <code><a href="./src/resources/load-balancers/previews.ts">PreviewGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/load_balancers/preview/{preview_id}">client.loadBalancers.previews.<a href="./src/resources/load-balancers/previews.ts">get</a>(previewId, { ...params }) -> PreviewGetResponse</code>

## Regions

Types:

- <code><a href="./src/resources/load-balancers/regions.ts">RegionListResponse</a></code>
- <code><a href="./src/resources/load-balancers/regions.ts">RegionGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/load_balancers/regions">client.loadBalancers.regions.<a href="./src/resources/load-balancers/regions.ts">list</a>({ ...params }) -> RegionListResponse</code>
- <code title="get /accounts/{account_id}/load_balancers/regions/{region_id}">client.loadBalancers.regions.<a href="./src/resources/load-balancers/regions.ts">get</a>(regionId, { ...params }) -> RegionGetResponse</code>

## Searches

Types:

- <code><a href="./src/resources/load-balancers/searches.ts">SearchGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/load_balancers/search">client.loadBalancers.searches.<a href="./src/resources/load-balancers/searches.ts">get</a>({ ...params }) -> SearchGetResponse | null</code>

# Cache

Types:

- <code><a href="./src/resources/cache/cache.ts">CachePurgeResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/purge_cache">client.cache.<a href="./src/resources/cache/cache.ts">purge</a>({ ...params }) -> CachePurgeResponse | null</code>

## CacheReserve

Types:

- <code><a href="./src/resources/cache/cache-reserve.ts">CacheReserve</a></code>
- <code><a href="./src/resources/cache/cache-reserve.ts">CacheReserveClear</a></code>
- <code><a href="./src/resources/cache/cache-reserve.ts">State</a></code>
- <code><a href="./src/resources/cache/cache-reserve.ts">CacheReserveClearResponse</a></code>
- <code><a href="./src/resources/cache/cache-reserve.ts">CacheReserveEditResponse</a></code>
- <code><a href="./src/resources/cache/cache-reserve.ts">CacheReserveGetResponse</a></code>
- <code><a href="./src/resources/cache/cache-reserve.ts">CacheReserveStatusResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/cache/cache_reserve_clear">client.cache.cacheReserve.<a href="./src/resources/cache/cache-reserve.ts">clear</a>({ ...params }) -> CacheReserveClearResponse</code>
- <code title="patch /zones/{zone_id}/cache/cache_reserve">client.cache.cacheReserve.<a href="./src/resources/cache/cache-reserve.ts">edit</a>({ ...params }) -> CacheReserveEditResponse</code>
- <code title="get /zones/{zone_id}/cache/cache_reserve">client.cache.cacheReserve.<a href="./src/resources/cache/cache-reserve.ts">get</a>({ ...params }) -> CacheReserveGetResponse</code>
- <code title="get /zones/{zone_id}/cache/cache_reserve_clear">client.cache.cacheReserve.<a href="./src/resources/cache/cache-reserve.ts">status</a>({ ...params }) -> CacheReserveStatusResponse</code>

## SmartTieredCache

Types:

- <code><a href="./src/resources/cache/smart-tiered-cache.ts">SmartTieredCacheDeleteResponse</a></code>
- <code><a href="./src/resources/cache/smart-tiered-cache.ts">SmartTieredCacheEditResponse</a></code>
- <code><a href="./src/resources/cache/smart-tiered-cache.ts">SmartTieredCacheGetResponse</a></code>

Methods:

- <code title="delete /zones/{zone_id}/cache/tiered_cache_smart_topology_enable">client.cache.smartTieredCache.<a href="./src/resources/cache/smart-tiered-cache.ts">delete</a>({ ...params }) -> SmartTieredCacheDeleteResponse</code>
- <code title="patch /zones/{zone_id}/cache/tiered_cache_smart_topology_enable">client.cache.smartTieredCache.<a href="./src/resources/cache/smart-tiered-cache.ts">edit</a>({ ...params }) -> SmartTieredCacheEditResponse</code>
- <code title="get /zones/{zone_id}/cache/tiered_cache_smart_topology_enable">client.cache.smartTieredCache.<a href="./src/resources/cache/smart-tiered-cache.ts">get</a>({ ...params }) -> SmartTieredCacheGetResponse</code>

## Variants

Types:

- <code><a href="./src/resources/cache/variants.ts">CacheVariant</a></code>
- <code><a href="./src/resources/cache/variants.ts">CacheVariantIdentifier</a></code>
- <code><a href="./src/resources/cache/variants.ts">VariantEditResponse</a></code>
- <code><a href="./src/resources/cache/variants.ts">VariantGetResponse</a></code>

Methods:

- <code title="delete /zones/{zone_id}/cache/variants">client.cache.variants.<a href="./src/resources/cache/variants.ts">delete</a>({ ...params }) -> CacheVariant</code>
- <code title="patch /zones/{zone_id}/cache/variants">client.cache.variants.<a href="./src/resources/cache/variants.ts">edit</a>({ ...params }) -> VariantEditResponse</code>
- <code title="get /zones/{zone_id}/cache/variants">client.cache.variants.<a href="./src/resources/cache/variants.ts">get</a>({ ...params }) -> VariantGetResponse</code>

## RegionalTieredCache

Types:

- <code><a href="./src/resources/cache/regional-tiered-cache.ts">RegionalTieredCache</a></code>
- <code><a href="./src/resources/cache/regional-tiered-cache.ts">RegionalTieredCacheEditResponse</a></code>
- <code><a href="./src/resources/cache/regional-tiered-cache.ts">RegionalTieredCacheGetResponse</a></code>

Methods:

- <code title="patch /zones/{zone_id}/cache/regional_tiered_cache">client.cache.regionalTieredCache.<a href="./src/resources/cache/regional-tiered-cache.ts">edit</a>({ ...params }) -> RegionalTieredCacheEditResponse</code>
- <code title="get /zones/{zone_id}/cache/regional_tiered_cache">client.cache.regionalTieredCache.<a href="./src/resources/cache/regional-tiered-cache.ts">get</a>({ ...params }) -> RegionalTieredCacheGetResponse</code>

# SSL

## Analyze

Types:

- <code><a href="./src/resources/ssl/analyze.ts">AnalyzeCreateResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/ssl/analyze">client.ssl.analyze.<a href="./src/resources/ssl/analyze.ts">create</a>({ ...params }) -> AnalyzeCreateResponse</code>

## CertificatePacks

Types:

- <code><a href="./src/resources/ssl/certificate-packs/certificate-packs.ts">Host</a></code>
- <code><a href="./src/resources/ssl/certificate-packs/certificate-packs.ts">RequestValidity</a></code>
- <code><a href="./src/resources/ssl/certificate-packs/certificate-packs.ts">Status</a></code>
- <code><a href="./src/resources/ssl/certificate-packs/certificate-packs.ts">ValidationMethod</a></code>
- <code><a href="./src/resources/ssl/certificate-packs/certificate-packs.ts">CertificatePackListResponse</a></code>
- <code><a href="./src/resources/ssl/certificate-packs/certificate-packs.ts">CertificatePackDeleteResponse</a></code>
- <code><a href="./src/resources/ssl/certificate-packs/certificate-packs.ts">CertificatePackEditResponse</a></code>
- <code><a href="./src/resources/ssl/certificate-packs/certificate-packs.ts">CertificatePackGetResponse</a></code>

Methods:

- <code title="get /zones/{zone_id}/ssl/certificate_packs">client.ssl.certificatePacks.<a href="./src/resources/ssl/certificate-packs/certificate-packs.ts">list</a>({ ...params }) -> CertificatePackListResponsesSinglePage</code>
- <code title="delete /zones/{zone_id}/ssl/certificate_packs/{certificate_pack_id}">client.ssl.certificatePacks.<a href="./src/resources/ssl/certificate-packs/certificate-packs.ts">delete</a>(certificatePackId, { ...params }) -> CertificatePackDeleteResponse</code>
- <code title="patch /zones/{zone_id}/ssl/certificate_packs/{certificate_pack_id}">client.ssl.certificatePacks.<a href="./src/resources/ssl/certificate-packs/certificate-packs.ts">edit</a>(certificatePackId, { ...params }) -> CertificatePackEditResponse</code>
- <code title="get /zones/{zone_id}/ssl/certificate_packs/{certificate_pack_id}">client.ssl.certificatePacks.<a href="./src/resources/ssl/certificate-packs/certificate-packs.ts">get</a>(certificatePackId, { ...params }) -> CertificatePackGetResponse</code>

### Order

Types:

- <code><a href="./src/resources/ssl/certificate-packs/order.ts">OrderCreateResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/ssl/certificate_packs/order">client.ssl.certificatePacks.order.<a href="./src/resources/ssl/certificate-packs/order.ts">create</a>({ ...params }) -> OrderCreateResponse</code>

### Quota

Types:

- <code><a href="./src/resources/ssl/certificate-packs/quota.ts">QuotaGetResponse</a></code>

Methods:

- <code title="get /zones/{zone_id}/ssl/certificate_packs/quota">client.ssl.certificatePacks.quota.<a href="./src/resources/ssl/certificate-packs/quota.ts">get</a>({ ...params }) -> QuotaGetResponse</code>

## Recommendations

Types:

- <code><a href="./src/resources/ssl/recommendations.ts">RecommendationGetResponse</a></code>

Methods:

- <code title="get /zones/{zone_identifier}/ssl/recommendation">client.ssl.recommendations.<a href="./src/resources/ssl/recommendations.ts">get</a>(zoneIdentifier) -> RecommendationGetResponse | null</code>

## Universal

### Settings

Types:

- <code><a href="./src/resources/ssl/universal/settings.ts">UniversalSSLSettings</a></code>

Methods:

- <code title="patch /zones/{zone_id}/ssl/universal/settings">client.ssl.universal.settings.<a href="./src/resources/ssl/universal/settings.ts">edit</a>({ ...params }) -> UniversalSSLSettings</code>
- <code title="get /zones/{zone_id}/ssl/universal/settings">client.ssl.universal.settings.<a href="./src/resources/ssl/universal/settings.ts">get</a>({ ...params }) -> UniversalSSLSettings</code>

## Verification

Types:

- <code><a href="./src/resources/ssl/verification.ts">Verification</a></code>
- <code><a href="./src/resources/ssl/verification.ts">VerificationEditResponse</a></code>
- <code><a href="./src/resources/ssl/verification.ts">VerificationGetResponse</a></code>

Methods:

- <code title="patch /zones/{zone_id}/ssl/verification/{certificate_pack_id}">client.ssl.verification.<a href="./src/resources/ssl/verification.ts">edit</a>(certificatePackId, { ...params }) -> VerificationEditResponse</code>
- <code title="get /zones/{zone_id}/ssl/verification">client.ssl.verification.<a href="./src/resources/ssl/verification.ts">get</a>({ ...params }) -> VerificationGetResponse</code>

# Subscriptions

Types:

- <code><a href="./src/resources/subscriptions.ts">SubscriptionCreateResponse</a></code>
- <code><a href="./src/resources/subscriptions.ts">SubscriptionUpdateResponse</a></code>
- <code><a href="./src/resources/subscriptions.ts">SubscriptionDeleteResponse</a></code>
- <code><a href="./src/resources/subscriptions.ts">SubscriptionGetResponse</a></code>

Methods:

- <code title="post /zones/{identifier}/subscription">client.subscriptions.<a href="./src/resources/subscriptions.ts">create</a>(identifier, { ...params }) -> SubscriptionCreateResponse</code>
- <code title="put /accounts/{account_identifier}/subscriptions/{subscription_identifier}">client.subscriptions.<a href="./src/resources/subscriptions.ts">update</a>(accountIdentifier, subscriptionIdentifier, { ...params }) -> SubscriptionUpdateResponse</code>
- <code title="get /accounts/{account_identifier}/subscriptions">client.subscriptions.<a href="./src/resources/subscriptions.ts">list</a>(accountIdentifier) -> SubscriptionsSinglePage</code>
- <code title="delete /accounts/{account_identifier}/subscriptions/{subscription_identifier}">client.subscriptions.<a href="./src/resources/subscriptions.ts">delete</a>(accountIdentifier, subscriptionIdentifier) -> SubscriptionDeleteResponse</code>
- <code title="get /zones/{identifier}/subscription">client.subscriptions.<a href="./src/resources/subscriptions.ts">get</a>(identifier) -> SubscriptionGetResponse</code>

# ACM

## TotalTLS

Types:

- <code><a href="./src/resources/acm/total-tls.ts">CertificateAuthority</a></code>
- <code><a href="./src/resources/acm/total-tls.ts">TotalTLSCreateResponse</a></code>
- <code><a href="./src/resources/acm/total-tls.ts">TotalTLSGetResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/acm/total_tls">client.acm.totalTLS.<a href="./src/resources/acm/total-tls.ts">create</a>({ ...params }) -> TotalTLSCreateResponse</code>
- <code title="get /zones/{zone_id}/acm/total_tls">client.acm.totalTLS.<a href="./src/resources/acm/total-tls.ts">get</a>({ ...params }) -> TotalTLSGetResponse</code>

# Argo

## SmartRouting

Types:

- <code><a href="./src/resources/argo/smart-routing.ts">SmartRoutingEditResponse</a></code>
- <code><a href="./src/resources/argo/smart-routing.ts">SmartRoutingGetResponse</a></code>

Methods:

- <code title="patch /zones/{zone_id}/argo/smart_routing">client.argo.smartRouting.<a href="./src/resources/argo/smart-routing.ts">edit</a>({ ...params }) -> SmartRoutingEditResponse</code>
- <code title="get /zones/{zone_id}/argo/smart_routing">client.argo.smartRouting.<a href="./src/resources/argo/smart-routing.ts">get</a>({ ...params }) -> SmartRoutingGetResponse</code>

## TieredCaching

Types:

- <code><a href="./src/resources/argo/tiered-caching.ts">TieredCachingEditResponse</a></code>
- <code><a href="./src/resources/argo/tiered-caching.ts">TieredCachingGetResponse</a></code>

Methods:

- <code title="patch /zones/{zone_id}/argo/tiered_caching">client.argo.tieredCaching.<a href="./src/resources/argo/tiered-caching.ts">edit</a>({ ...params }) -> TieredCachingEditResponse</code>
- <code title="get /zones/{zone_id}/argo/tiered_caching">client.argo.tieredCaching.<a href="./src/resources/argo/tiered-caching.ts">get</a>({ ...params }) -> TieredCachingGetResponse</code>

# Plans

Types:

- <code><a href="./src/resources/plans.ts">AvailableRatePlan</a></code>

Methods:

- <code title="get /zones/{zone_identifier}/available_plans">client.plans.<a href="./src/resources/plans.ts">list</a>(zoneIdentifier) -> AvailableRatePlansSinglePage</code>
- <code title="get /zones/{zone_identifier}/available_plans/{plan_identifier}">client.plans.<a href="./src/resources/plans.ts">get</a>(zoneIdentifier, planIdentifier) -> AvailableRatePlan</code>

# RatePlans

Types:

- <code><a href="./src/resources/rate-plans.ts">RatePlan</a></code>
- <code><a href="./src/resources/rate-plans.ts">RatePlanGetResponse</a></code>

Methods:

- <code title="get /zones/{zone_identifier}/available_rate_plans">client.ratePlans.<a href="./src/resources/rate-plans.ts">get</a>(zoneIdentifier) -> RatePlanGetResponse | null</code>

# CertificateAuthorities

## HostnameAssociations

Types:

- <code><a href="./src/resources/certificate-authorities/hostname-associations.ts">HostnameAssociation</a></code>
- <code><a href="./src/resources/certificate-authorities/hostname-associations.ts">TLSHostnameAssociation</a></code>
- <code><a href="./src/resources/certificate-authorities/hostname-associations.ts">HostnameAssociationUpdateResponse</a></code>
- <code><a href="./src/resources/certificate-authorities/hostname-associations.ts">HostnameAssociationGetResponse</a></code>

Methods:

- <code title="put /zones/{zone_id}/certificate_authorities/hostname_associations">client.certificateAuthorities.hostnameAssociations.<a href="./src/resources/certificate-authorities/hostname-associations.ts">update</a>({ ...params }) -> HostnameAssociationUpdateResponse</code>
- <code title="get /zones/{zone_id}/certificate_authorities/hostname_associations">client.certificateAuthorities.hostnameAssociations.<a href="./src/resources/certificate-authorities/hostname-associations.ts">get</a>({ ...params }) -> HostnameAssociationGetResponse</code>

# ClientCertificates

Types:

- <code><a href="./src/resources/client-certificates.ts">ClientCertificate</a></code>

Methods:

- <code title="post /zones/{zone_id}/client_certificates">client.clientCertificates.<a href="./src/resources/client-certificates.ts">create</a>({ ...params }) -> ClientCertificate</code>
- <code title="get /zones/{zone_id}/client_certificates">client.clientCertificates.<a href="./src/resources/client-certificates.ts">list</a>({ ...params }) -> ClientCertificatesV4PagePaginationArray</code>
- <code title="delete /zones/{zone_id}/client_certificates/{client_certificate_id}">client.clientCertificates.<a href="./src/resources/client-certificates.ts">delete</a>(clientCertificateId, { ...params }) -> ClientCertificate</code>
- <code title="patch /zones/{zone_id}/client_certificates/{client_certificate_id}">client.clientCertificates.<a href="./src/resources/client-certificates.ts">edit</a>(clientCertificateId, { ...params }) -> ClientCertificate</code>
- <code title="get /zones/{zone_id}/client_certificates/{client_certificate_id}">client.clientCertificates.<a href="./src/resources/client-certificates.ts">get</a>(clientCertificateId, { ...params }) -> ClientCertificate</code>

# CustomCertificates

Types:

- <code><a href="./src/resources/custom-certificates/custom-certificates.ts">CustomCertificate</a></code>
- <code><a href="./src/resources/custom-certificates/custom-certificates.ts">GeoRestrictions</a></code>
- <code><a href="./src/resources/custom-certificates/custom-certificates.ts">Status</a></code>
- <code><a href="./src/resources/custom-certificates/custom-certificates.ts">CustomCertificateCreateResponse</a></code>
- <code><a href="./src/resources/custom-certificates/custom-certificates.ts">CustomCertificateDeleteResponse</a></code>
- <code><a href="./src/resources/custom-certificates/custom-certificates.ts">CustomCertificateEditResponse</a></code>
- <code><a href="./src/resources/custom-certificates/custom-certificates.ts">CustomCertificateGetResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/custom_certificates">client.customCertificates.<a href="./src/resources/custom-certificates/custom-certificates.ts">create</a>({ ...params }) -> CustomCertificateCreateResponse</code>
- <code title="get /zones/{zone_id}/custom_certificates">client.customCertificates.<a href="./src/resources/custom-certificates/custom-certificates.ts">list</a>({ ...params }) -> CustomCertificatesV4PagePaginationArray</code>
- <code title="delete /zones/{zone_id}/custom_certificates/{custom_certificate_id}">client.customCertificates.<a href="./src/resources/custom-certificates/custom-certificates.ts">delete</a>(customCertificateId, { ...params }) -> CustomCertificateDeleteResponse</code>
- <code title="patch /zones/{zone_id}/custom_certificates/{custom_certificate_id}">client.customCertificates.<a href="./src/resources/custom-certificates/custom-certificates.ts">edit</a>(customCertificateId, { ...params }) -> CustomCertificateEditResponse</code>
- <code title="get /zones/{zone_id}/custom_certificates/{custom_certificate_id}">client.customCertificates.<a href="./src/resources/custom-certificates/custom-certificates.ts">get</a>(customCertificateId, { ...params }) -> CustomCertificateGetResponse</code>

## Prioritize

Types:

- <code><a href="./src/resources/custom-certificates/prioritize.ts">PrioritizeUpdateResponse</a></code>

Methods:

- <code title="put /zones/{zone_id}/custom_certificates/prioritize">client.customCertificates.prioritize.<a href="./src/resources/custom-certificates/prioritize.ts">update</a>({ ...params }) -> PrioritizeUpdateResponse | null</code>

# CustomHostnames

Types:

- <code><a href="./src/resources/custom-hostnames/custom-hostnames.ts">BundleMethod</a></code>
- <code><a href="./src/resources/custom-hostnames/custom-hostnames.ts">CustomHostname</a></code>
- <code><a href="./src/resources/custom-hostnames/custom-hostnames.ts">DCVMethod</a></code>
- <code><a href="./src/resources/custom-hostnames/custom-hostnames.ts">DomainValidationType</a></code>
- <code><a href="./src/resources/custom-hostnames/custom-hostnames.ts">CustomHostnameCreateResponse</a></code>
- <code><a href="./src/resources/custom-hostnames/custom-hostnames.ts">CustomHostnameListResponse</a></code>
- <code><a href="./src/resources/custom-hostnames/custom-hostnames.ts">CustomHostnameDeleteResponse</a></code>
- <code><a href="./src/resources/custom-hostnames/custom-hostnames.ts">CustomHostnameEditResponse</a></code>
- <code><a href="./src/resources/custom-hostnames/custom-hostnames.ts">CustomHostnameGetResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/custom_hostnames">client.customHostnames.<a href="./src/resources/custom-hostnames/custom-hostnames.ts">create</a>({ ...params }) -> CustomHostnameCreateResponse</code>
- <code title="get /zones/{zone_id}/custom_hostnames">client.customHostnames.<a href="./src/resources/custom-hostnames/custom-hostnames.ts">list</a>({ ...params }) -> CustomHostnameListResponsesV4PagePaginationArray</code>
- <code title="delete /zones/{zone_id}/custom_hostnames/{custom_hostname_id}">client.customHostnames.<a href="./src/resources/custom-hostnames/custom-hostnames.ts">delete</a>(customHostnameId, { ...params }) -> CustomHostnameDeleteResponse</code>
- <code title="patch /zones/{zone_id}/custom_hostnames/{custom_hostname_id}">client.customHostnames.<a href="./src/resources/custom-hostnames/custom-hostnames.ts">edit</a>(customHostnameId, { ...params }) -> CustomHostnameEditResponse</code>
- <code title="get /zones/{zone_id}/custom_hostnames/{custom_hostname_id}">client.customHostnames.<a href="./src/resources/custom-hostnames/custom-hostnames.ts">get</a>(customHostnameId, { ...params }) -> CustomHostnameGetResponse</code>

## FallbackOrigin

Types:

- <code><a href="./src/resources/custom-hostnames/fallback-origin.ts">FallbackOriginUpdateResponse</a></code>
- <code><a href="./src/resources/custom-hostnames/fallback-origin.ts">FallbackOriginDeleteResponse</a></code>
- <code><a href="./src/resources/custom-hostnames/fallback-origin.ts">FallbackOriginGetResponse</a></code>

Methods:

- <code title="put /zones/{zone_id}/custom_hostnames/fallback_origin">client.customHostnames.fallbackOrigin.<a href="./src/resources/custom-hostnames/fallback-origin.ts">update</a>({ ...params }) -> FallbackOriginUpdateResponse</code>
- <code title="delete /zones/{zone_id}/custom_hostnames/fallback_origin">client.customHostnames.fallbackOrigin.<a href="./src/resources/custom-hostnames/fallback-origin.ts">delete</a>({ ...params }) -> FallbackOriginDeleteResponse</code>
- <code title="get /zones/{zone_id}/custom_hostnames/fallback_origin">client.customHostnames.fallbackOrigin.<a href="./src/resources/custom-hostnames/fallback-origin.ts">get</a>({ ...params }) -> FallbackOriginGetResponse</code>

# CustomNameservers

Types:

- <code><a href="./src/resources/custom-nameservers.ts">CustomNameserver</a></code>
- <code><a href="./src/resources/custom-nameservers.ts">CustomNameserverDeleteResponse</a></code>
- <code><a href="./src/resources/custom-nameservers.ts">CustomNameserverAvailabiltyResponse</a></code>
- <code><a href="./src/resources/custom-nameservers.ts">CustomNameserverGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/custom_ns">client.customNameservers.<a href="./src/resources/custom-nameservers.ts">create</a>({ ...params }) -> CustomNameserver</code>
- <code title="delete /accounts/{account_id}/custom_ns/{custom_ns_id}">client.customNameservers.<a href="./src/resources/custom-nameservers.ts">delete</a>(customNSId, { ...params }) -> CustomNameserverDeleteResponse | null</code>
- <code title="get /accounts/{account_id}/custom_ns/availability">client.customNameservers.<a href="./src/resources/custom-nameservers.ts">availabilty</a>({ ...params }) -> CustomNameserverAvailabiltyResponse | null</code>
- <code title="get /accounts/{account_id}/custom_ns">client.customNameservers.<a href="./src/resources/custom-nameservers.ts">get</a>({ ...params }) -> CustomNameserverGetResponse | null</code>

# DNS

Types:

- <code><a href="./src/resources/dns/dns.ts">DNSAnalyticsNominalMetric</a></code>
- <code><a href="./src/resources/dns/dns.ts">DNSAnalyticsQuery</a></code>

## Records

Types:

- <code><a href="./src/resources/dns/records.ts">ARecord</a></code>
- <code><a href="./src/resources/dns/records.ts">AAAARecord</a></code>
- <code><a href="./src/resources/dns/records.ts">CAARecord</a></code>
- <code><a href="./src/resources/dns/records.ts">CERTRecord</a></code>
- <code><a href="./src/resources/dns/records.ts">CNAMERecord</a></code>
- <code><a href="./src/resources/dns/records.ts">DNSKEYRecord</a></code>
- <code><a href="./src/resources/dns/records.ts">DSRecord</a></code>
- <code><a href="./src/resources/dns/records.ts">HTTPSRecord</a></code>
- <code><a href="./src/resources/dns/records.ts">LOCRecord</a></code>
- <code><a href="./src/resources/dns/records.ts">MXRecord</a></code>
- <code><a href="./src/resources/dns/records.ts">NAPTRRecord</a></code>
- <code><a href="./src/resources/dns/records.ts">NSRecord</a></code>
- <code><a href="./src/resources/dns/records.ts">PTRRecord</a></code>
- <code><a href="./src/resources/dns/records.ts">Record</a></code>
- <code><a href="./src/resources/dns/records.ts">RecordMetadata</a></code>
- <code><a href="./src/resources/dns/records.ts">RecordProcessTiming</a></code>
- <code><a href="./src/resources/dns/records.ts">RecordTags</a></code>
- <code><a href="./src/resources/dns/records.ts">SMIMEARecord</a></code>
- <code><a href="./src/resources/dns/records.ts">SRVRecord</a></code>
- <code><a href="./src/resources/dns/records.ts">SSHFPRecord</a></code>
- <code><a href="./src/resources/dns/records.ts">SVCBRecord</a></code>
- <code><a href="./src/resources/dns/records.ts">TLSARecord</a></code>
- <code><a href="./src/resources/dns/records.ts">TTL</a></code>
- <code><a href="./src/resources/dns/records.ts">TXTRecord</a></code>
- <code><a href="./src/resources/dns/records.ts">URIRecord</a></code>
- <code><a href="./src/resources/dns/records.ts">RecordDeleteResponse</a></code>
- <code><a href="./src/resources/dns/records.ts">RecordExportResponse</a></code>
- <code><a href="./src/resources/dns/records.ts">RecordImportResponse</a></code>
- <code><a href="./src/resources/dns/records.ts">RecordScanResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/dns_records">client.dns.records.<a href="./src/resources/dns/records.ts">create</a>({ ...params }) -> Record</code>
- <code title="put /zones/{zone_id}/dns_records/{dns_record_id}">client.dns.records.<a href="./src/resources/dns/records.ts">update</a>(dnsRecordId, { ...params }) -> Record</code>
- <code title="get /zones/{zone_id}/dns_records">client.dns.records.<a href="./src/resources/dns/records.ts">list</a>({ ...params }) -> RecordsV4PagePaginationArray</code>
- <code title="delete /zones/{zone_id}/dns_records/{dns_record_id}">client.dns.records.<a href="./src/resources/dns/records.ts">delete</a>(dnsRecordId, { ...params }) -> RecordDeleteResponse</code>
- <code title="patch /zones/{zone_id}/dns_records/{dns_record_id}">client.dns.records.<a href="./src/resources/dns/records.ts">edit</a>(dnsRecordId, { ...params }) -> Record</code>
- <code title="get /zones/{zone_id}/dns_records/export">client.dns.records.<a href="./src/resources/dns/records.ts">export</a>({ ...params }) -> string</code>
- <code title="get /zones/{zone_id}/dns_records/{dns_record_id}">client.dns.records.<a href="./src/resources/dns/records.ts">get</a>(dnsRecordId, { ...params }) -> Record</code>
- <code title="post /zones/{zone_id}/dns_records/import">client.dns.records.<a href="./src/resources/dns/records.ts">import</a>({ ...params }) -> RecordImportResponse</code>
- <code title="post /zones/{zone_id}/dns_records/scan">client.dns.records.<a href="./src/resources/dns/records.ts">scan</a>({ ...params }) -> RecordScanResponse</code>

## Settings

Types:

- <code><a href="./src/resources/dns/settings.ts">DNSSetting</a></code>
- <code><a href="./src/resources/dns/settings.ts">Nameserver</a></code>
- <code><a href="./src/resources/dns/settings.ts">SettingEditResponse</a></code>
- <code><a href="./src/resources/dns/settings.ts">SettingGetResponse</a></code>

Methods:

- <code title="patch /{account_or_zone}/{account_or_zone_id}/dns_settings">client.dns.settings.<a href="./src/resources/dns/settings.ts">edit</a>({ ...params }) -> SettingEditResponse</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/dns_settings">client.dns.settings.<a href="./src/resources/dns/settings.ts">get</a>({ ...params }) -> SettingGetResponse</code>

## Analytics

### Reports

Types:

- <code><a href="./src/resources/dns/analytics/reports/reports.ts">Report</a></code>

Methods:

- <code title="get /zones/{zone_id}/dns_analytics/report">client.dns.analytics.reports.<a href="./src/resources/dns/analytics/reports/reports.ts">get</a>({ ...params }) -> Report</code>

#### Bytimes

Types:

- <code><a href="./src/resources/dns/analytics/reports/bytimes.ts">ByTime</a></code>

Methods:

- <code title="get /zones/{zone_id}/dns_analytics/report/bytime">client.dns.analytics.reports.bytimes.<a href="./src/resources/dns/analytics/reports/bytimes.ts">get</a>({ ...params }) -> ByTime</code>

## Firewall

Types:

- <code><a href="./src/resources/dns/firewall/firewall.ts">AttackMitigation</a></code>
- <code><a href="./src/resources/dns/firewall/firewall.ts">Firewall</a></code>
- <code><a href="./src/resources/dns/firewall/firewall.ts">FirewallIPs</a></code>
- <code><a href="./src/resources/dns/firewall/firewall.ts">UpstreamIPs</a></code>
- <code><a href="./src/resources/dns/firewall/firewall.ts">FirewallDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/dns_firewall">client.dns.firewall.<a href="./src/resources/dns/firewall/firewall.ts">create</a>({ ...params }) -> Firewall</code>
- <code title="get /accounts/{account_id}/dns_firewall">client.dns.firewall.<a href="./src/resources/dns/firewall/firewall.ts">list</a>({ ...params }) -> FirewallsV4PagePaginationArray</code>
- <code title="delete /accounts/{account_id}/dns_firewall/{dns_firewall_id}">client.dns.firewall.<a href="./src/resources/dns/firewall/firewall.ts">delete</a>(dnsFirewallId, { ...params }) -> FirewallDeleteResponse</code>
- <code title="patch /accounts/{account_id}/dns_firewall/{dns_firewall_id}">client.dns.firewall.<a href="./src/resources/dns/firewall/firewall.ts">edit</a>(dnsFirewallId, { ...params }) -> Firewall</code>
- <code title="get /accounts/{account_id}/dns_firewall/{dns_firewall_id}">client.dns.firewall.<a href="./src/resources/dns/firewall/firewall.ts">get</a>(dnsFirewallId, { ...params }) -> Firewall</code>

### Analytics

Types:

- <code><a href="./src/resources/dns/firewall/analytics/analytics.ts">Delta</a></code>

#### Reports

Methods:

- <code title="get /accounts/{account_id}/dns_firewall/{dns_firewall_id}/dns_analytics/report">client.dns.firewall.analytics.reports.<a href="./src/resources/dns/firewall/analytics/reports/reports.ts">get</a>(dnsFirewallId, { ...params }) -> Report</code>

##### Bytimes

Methods:

- <code title="get /accounts/{account_id}/dns_firewall/{dns_firewall_id}/dns_analytics/report/bytime">client.dns.firewall.analytics.reports.bytimes.<a href="./src/resources/dns/firewall/analytics/reports/bytimes.ts">get</a>(dnsFirewallId, { ...params }) -> ByTime</code>

# DNSSEC

Types:

- <code><a href="./src/resources/dnssec.ts">DNSSEC</a></code>
- <code><a href="./src/resources/dnssec.ts">DNSSECDeleteResponse</a></code>

Methods:

- <code title="delete /zones/{zone_id}/dnssec">client.dnssec.<a href="./src/resources/dnssec.ts">delete</a>({ ...params }) -> DNSSECDeleteResponse</code>
- <code title="patch /zones/{zone_id}/dnssec">client.dnssec.<a href="./src/resources/dnssec.ts">edit</a>({ ...params }) -> DNSSEC</code>
- <code title="get /zones/{zone_id}/dnssec">client.dnssec.<a href="./src/resources/dnssec.ts">get</a>({ ...params }) -> DNSSEC</code>

# EmailRouting

Types:

- <code><a href="./src/resources/email-routing/email-routing.ts">Settings</a></code>

Methods:

- <code title="post /zones/{zone_identifier}/email/routing/disable">client.emailRouting.<a href="./src/resources/email-routing/email-routing.ts">disable</a>(zoneIdentifier, { ...params }) -> Settings</code>
- <code title="post /zones/{zone_identifier}/email/routing/enable">client.emailRouting.<a href="./src/resources/email-routing/email-routing.ts">enable</a>(zoneIdentifier, { ...params }) -> Settings</code>
- <code title="get /zones/{zone_identifier}/email/routing">client.emailRouting.<a href="./src/resources/email-routing/email-routing.ts">get</a>(zoneIdentifier) -> Settings</code>

## DNS

Types:

- <code><a href="./src/resources/email-routing/dns.ts">DNSRecord</a></code>
- <code><a href="./src/resources/email-routing/dns.ts">DNSGetResponse</a></code>

Methods:

- <code title="get /zones/{zone_identifier}/email/routing/dns">client.emailRouting.dns.<a href="./src/resources/email-routing/dns.ts">get</a>(zoneIdentifier) -> DNSGetResponse | null</code>

## Rules

Types:

- <code><a href="./src/resources/email-routing/rules/rules.ts">Action</a></code>
- <code><a href="./src/resources/email-routing/rules/rules.ts">EmailRoutingRule</a></code>
- <code><a href="./src/resources/email-routing/rules/rules.ts">Matcher</a></code>

Methods:

- <code title="post /zones/{zone_identifier}/email/routing/rules">client.emailRouting.rules.<a href="./src/resources/email-routing/rules/rules.ts">create</a>(zoneIdentifier, { ...params }) -> EmailRoutingRule</code>
- <code title="put /zones/{zone_identifier}/email/routing/rules/{rule_identifier}">client.emailRouting.rules.<a href="./src/resources/email-routing/rules/rules.ts">update</a>(zoneIdentifier, ruleIdentifier, { ...params }) -> EmailRoutingRule</code>
- <code title="get /zones/{zone_identifier}/email/routing/rules">client.emailRouting.rules.<a href="./src/resources/email-routing/rules/rules.ts">list</a>(zoneIdentifier, { ...params }) -> EmailRoutingRulesV4PagePaginationArray</code>
- <code title="delete /zones/{zone_identifier}/email/routing/rules/{rule_identifier}">client.emailRouting.rules.<a href="./src/resources/email-routing/rules/rules.ts">delete</a>(zoneIdentifier, ruleIdentifier) -> EmailRoutingRule</code>
- <code title="get /zones/{zone_identifier}/email/routing/rules/{rule_identifier}">client.emailRouting.rules.<a href="./src/resources/email-routing/rules/rules.ts">get</a>(zoneIdentifier, ruleIdentifier) -> EmailRoutingRule</code>

### CatchAlls

Types:

- <code><a href="./src/resources/email-routing/rules/catch-alls.ts">CatchAllAction</a></code>
- <code><a href="./src/resources/email-routing/rules/catch-alls.ts">CatchAllMatcher</a></code>
- <code><a href="./src/resources/email-routing/rules/catch-alls.ts">CatchAllUpdateResponse</a></code>
- <code><a href="./src/resources/email-routing/rules/catch-alls.ts">CatchAllGetResponse</a></code>

Methods:

- <code title="put /zones/{zone_identifier}/email/routing/rules/catch_all">client.emailRouting.rules.catchAlls.<a href="./src/resources/email-routing/rules/catch-alls.ts">update</a>(zoneIdentifier, { ...params }) -> CatchAllUpdateResponse</code>
- <code title="get /zones/{zone_identifier}/email/routing/rules/catch_all">client.emailRouting.rules.catchAlls.<a href="./src/resources/email-routing/rules/catch-alls.ts">get</a>(zoneIdentifier) -> CatchAllGetResponse</code>

## Addresses

Types:

- <code><a href="./src/resources/email-routing/addresses.ts">Address</a></code>

Methods:

- <code title="post /accounts/{account_identifier}/email/routing/addresses">client.emailRouting.addresses.<a href="./src/resources/email-routing/addresses.ts">create</a>(accountIdentifier, { ...params }) -> Address</code>
- <code title="get /accounts/{account_identifier}/email/routing/addresses">client.emailRouting.addresses.<a href="./src/resources/email-routing/addresses.ts">list</a>(accountIdentifier, { ...params }) -> AddressesV4PagePaginationArray</code>
- <code title="delete /accounts/{account_identifier}/email/routing/addresses/{destination_address_identifier}">client.emailRouting.addresses.<a href="./src/resources/email-routing/addresses.ts">delete</a>(accountIdentifier, destinationAddressIdentifier) -> Address</code>
- <code title="get /accounts/{account_identifier}/email/routing/addresses/{destination_address_identifier}">client.emailRouting.addresses.<a href="./src/resources/email-routing/addresses.ts">get</a>(accountIdentifier, destinationAddressIdentifier) -> Address</code>

# Filters

Types:

- <code><a href="./src/resources/filters.ts">FirewallFilter</a></code>
- <code><a href="./src/resources/filters.ts">FilterCreateResponse</a></code>

Methods:

- <code title="post /zones/{zone_identifier}/filters">client.filters.<a href="./src/resources/filters.ts">create</a>(zoneIdentifier, { ...params }) -> FilterCreateResponse | null</code>
- <code title="put /zones/{zone_identifier}/filters/{id}">client.filters.<a href="./src/resources/filters.ts">update</a>(zoneIdentifier, id, { ...params }) -> FirewallFilter</code>
- <code title="get /zones/{zone_identifier}/filters">client.filters.<a href="./src/resources/filters.ts">list</a>(zoneIdentifier, { ...params }) -> FirewallFiltersV4PagePaginationArray</code>
- <code title="delete /zones/{zone_identifier}/filters/{id}">client.filters.<a href="./src/resources/filters.ts">delete</a>(zoneIdentifier, id) -> FirewallFilter</code>
- <code title="get /zones/{zone_identifier}/filters/{id}">client.filters.<a href="./src/resources/filters.ts">get</a>(zoneIdentifier, id) -> FirewallFilter</code>

# Firewall

## Lockdowns

Types:

- <code><a href="./src/resources/firewall/lockdowns.ts">Configuration</a></code>
- <code><a href="./src/resources/firewall/lockdowns.ts">Lockdown</a></code>
- <code><a href="./src/resources/firewall/lockdowns.ts">LockdownCIDRConfiguration</a></code>
- <code><a href="./src/resources/firewall/lockdowns.ts">LockdownIPConfiguration</a></code>
- <code><a href="./src/resources/firewall/lockdowns.ts">LockdownURL</a></code>
- <code><a href="./src/resources/firewall/lockdowns.ts">LockdownDeleteResponse</a></code>

Methods:

- <code title="post /zones/{zone_identifier}/firewall/lockdowns">client.firewall.lockdowns.<a href="./src/resources/firewall/lockdowns.ts">create</a>(zoneIdentifier, { ...params }) -> Lockdown</code>
- <code title="put /zones/{zone_identifier}/firewall/lockdowns/{id}">client.firewall.lockdowns.<a href="./src/resources/firewall/lockdowns.ts">update</a>(zoneIdentifier, id, { ...params }) -> Lockdown</code>
- <code title="get /zones/{zone_identifier}/firewall/lockdowns">client.firewall.lockdowns.<a href="./src/resources/firewall/lockdowns.ts">list</a>(zoneIdentifier, { ...params }) -> LockdownsV4PagePaginationArray</code>
- <code title="delete /zones/{zone_identifier}/firewall/lockdowns/{id}">client.firewall.lockdowns.<a href="./src/resources/firewall/lockdowns.ts">delete</a>(zoneIdentifier, id) -> LockdownDeleteResponse</code>
- <code title="get /zones/{zone_identifier}/firewall/lockdowns/{id}">client.firewall.lockdowns.<a href="./src/resources/firewall/lockdowns.ts">get</a>(zoneIdentifier, id) -> Lockdown</code>

## Rules

Types:

- <code><a href="./src/resources/firewall/rules.ts">FirewallRule</a></code>
- <code><a href="./src/resources/firewall/rules.ts">Product</a></code>
- <code><a href="./src/resources/firewall/rules.ts">DeletedFilter</a></code>
- <code><a href="./src/resources/firewall/rules.ts">RuleCreateResponse</a></code>
- <code><a href="./src/resources/firewall/rules.ts">RuleEditResponse</a></code>

Methods:

- <code title="post /zones/{zone_identifier}/firewall/rules">client.firewall.rules.<a href="./src/resources/firewall/rules.ts">create</a>(zoneIdentifier, { ...params }) -> RuleCreateResponse | null</code>
- <code title="put /zones/{zone_identifier}/firewall/rules/{id}">client.firewall.rules.<a href="./src/resources/firewall/rules.ts">update</a>(zoneIdentifier, id, { ...params }) -> FirewallRule</code>
- <code title="get /zones/{zone_identifier}/firewall/rules">client.firewall.rules.<a href="./src/resources/firewall/rules.ts">list</a>(zoneIdentifier, { ...params }) -> FirewallRulesV4PagePaginationArray</code>
- <code title="delete /zones/{zone_identifier}/firewall/rules/{id}">client.firewall.rules.<a href="./src/resources/firewall/rules.ts">delete</a>(zoneIdentifier, id) -> FirewallRule</code>
- <code title="patch /zones/{zone_identifier}/firewall/rules/{id}">client.firewall.rules.<a href="./src/resources/firewall/rules.ts">edit</a>(zoneIdentifier, id, { ...params }) -> RuleEditResponse | null</code>
- <code title="get /zones/{zone_identifier}/firewall/rules/{id}">client.firewall.rules.<a href="./src/resources/firewall/rules.ts">get</a>(zoneIdentifier, { ...params }) -> FirewallRule</code>

## AccessRules

Types:

- <code><a href="./src/resources/firewall/access-rules.ts">AccessRuleCIDRConfiguration</a></code>
- <code><a href="./src/resources/firewall/access-rules.ts">AccessRuleIPConfiguration</a></code>
- <code><a href="./src/resources/firewall/access-rules.ts">ASNConfiguration</a></code>
- <code><a href="./src/resources/firewall/access-rules.ts">CountryConfiguration</a></code>
- <code><a href="./src/resources/firewall/access-rules.ts">IPV6Configuration</a></code>
- <code><a href="./src/resources/firewall/access-rules.ts">AccessRuleCreateResponse</a></code>
- <code><a href="./src/resources/firewall/access-rules.ts">AccessRuleListResponse</a></code>
- <code><a href="./src/resources/firewall/access-rules.ts">AccessRuleDeleteResponse</a></code>
- <code><a href="./src/resources/firewall/access-rules.ts">AccessRuleEditResponse</a></code>
- <code><a href="./src/resources/firewall/access-rules.ts">AccessRuleGetResponse</a></code>

Methods:

- <code title="post /{account_or_zone}/{account_or_zone_id}/firewall/access_rules/rules">client.firewall.accessRules.<a href="./src/resources/firewall/access-rules.ts">create</a>({ ...params }) -> AccessRuleCreateResponse</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/firewall/access_rules/rules">client.firewall.accessRules.<a href="./src/resources/firewall/access-rules.ts">list</a>({ ...params }) -> AccessRuleListResponsesV4PagePaginationArray</code>
- <code title="delete /{account_or_zone}/{account_or_zone_id}/firewall/access_rules/rules/{identifier}">client.firewall.accessRules.<a href="./src/resources/firewall/access-rules.ts">delete</a>(identifier, { ...params }) -> AccessRuleDeleteResponse | null</code>
- <code title="patch /{account_or_zone}/{account_or_zone_id}/firewall/access_rules/rules/{identifier}">client.firewall.accessRules.<a href="./src/resources/firewall/access-rules.ts">edit</a>(identifier, { ...params }) -> AccessRuleEditResponse</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/firewall/access_rules/rules/{identifier}">client.firewall.accessRules.<a href="./src/resources/firewall/access-rules.ts">get</a>(identifier, { ...params }) -> AccessRuleGetResponse</code>

## UARules

Types:

- <code><a href="./src/resources/firewall/ua-rules.ts">UARuleCreateResponse</a></code>
- <code><a href="./src/resources/firewall/ua-rules.ts">UARuleUpdateResponse</a></code>
- <code><a href="./src/resources/firewall/ua-rules.ts">UARuleListResponse</a></code>
- <code><a href="./src/resources/firewall/ua-rules.ts">UARuleDeleteResponse</a></code>
- <code><a href="./src/resources/firewall/ua-rules.ts">UARuleGetResponse</a></code>

Methods:

- <code title="post /zones/{zone_identifier}/firewall/ua_rules">client.firewall.uaRules.<a href="./src/resources/firewall/ua-rules.ts">create</a>(zoneIdentifier, { ...params }) -> UARuleCreateResponse</code>
- <code title="put /zones/{zone_identifier}/firewall/ua_rules/{id}">client.firewall.uaRules.<a href="./src/resources/firewall/ua-rules.ts">update</a>(zoneIdentifier, id, { ...params }) -> UARuleUpdateResponse</code>
- <code title="get /zones/{zone_identifier}/firewall/ua_rules">client.firewall.uaRules.<a href="./src/resources/firewall/ua-rules.ts">list</a>(zoneIdentifier, { ...params }) -> UARuleListResponsesV4PagePaginationArray</code>
- <code title="delete /zones/{zone_identifier}/firewall/ua_rules/{id}">client.firewall.uaRules.<a href="./src/resources/firewall/ua-rules.ts">delete</a>(zoneIdentifier, id) -> UARuleDeleteResponse</code>
- <code title="get /zones/{zone_identifier}/firewall/ua_rules/{id}">client.firewall.uaRules.<a href="./src/resources/firewall/ua-rules.ts">get</a>(zoneIdentifier, id) -> UARuleGetResponse</code>

## WAF

### Overrides

Types:

- <code><a href="./src/resources/firewall/waf/overrides.ts">Override</a></code>
- <code><a href="./src/resources/firewall/waf/overrides.ts">OverrideURL</a></code>
- <code><a href="./src/resources/firewall/waf/overrides.ts">RewriteAction</a></code>
- <code><a href="./src/resources/firewall/waf/overrides.ts">WAFRule</a></code>
- <code><a href="./src/resources/firewall/waf/overrides.ts">OverrideDeleteResponse</a></code>

Methods:

- <code title="post /zones/{zone_identifier}/firewall/waf/overrides">client.firewall.waf.overrides.<a href="./src/resources/firewall/waf/overrides.ts">create</a>(zoneIdentifier, { ...params }) -> Override</code>
- <code title="put /zones/{zone_identifier}/firewall/waf/overrides/{id}">client.firewall.waf.overrides.<a href="./src/resources/firewall/waf/overrides.ts">update</a>(zoneIdentifier, id, { ...params }) -> Override</code>
- <code title="get /zones/{zone_identifier}/firewall/waf/overrides">client.firewall.waf.overrides.<a href="./src/resources/firewall/waf/overrides.ts">list</a>(zoneIdentifier, { ...params }) -> OverridesV4PagePaginationArray</code>
- <code title="delete /zones/{zone_identifier}/firewall/waf/overrides/{id}">client.firewall.waf.overrides.<a href="./src/resources/firewall/waf/overrides.ts">delete</a>(zoneIdentifier, id) -> OverrideDeleteResponse</code>
- <code title="get /zones/{zone_identifier}/firewall/waf/overrides/{id}">client.firewall.waf.overrides.<a href="./src/resources/firewall/waf/overrides.ts">get</a>(zoneIdentifier, id) -> Override</code>

### Packages

Types:

- <code><a href="./src/resources/firewall/waf/packages/packages.ts">PackageListResponse</a></code>
- <code><a href="./src/resources/firewall/waf/packages/packages.ts">PackageGetResponse</a></code>

Methods:

- <code title="get /zones/{zone_identifier}/firewall/waf/packages">client.firewall.waf.packages.<a href="./src/resources/firewall/waf/packages/packages.ts">list</a>(zoneIdentifier, { ...params }) -> PackageListResponsesV4PagePaginationArray</code>
- <code title="get /zones/{zone_identifier}/firewall/waf/packages/{identifier}">client.firewall.waf.packages.<a href="./src/resources/firewall/waf/packages/packages.ts">get</a>(zoneIdentifier, identifier) -> PackageGetResponse</code>

#### Groups

Types:

- <code><a href="./src/resources/firewall/waf/packages/groups.ts">Group</a></code>
- <code><a href="./src/resources/firewall/waf/packages/groups.ts">GroupEditResponse</a></code>
- <code><a href="./src/resources/firewall/waf/packages/groups.ts">GroupGetResponse</a></code>

Methods:

- <code title="get /zones/{zone_id}/firewall/waf/packages/{package_id}/groups">client.firewall.waf.packages.groups.<a href="./src/resources/firewall/waf/packages/groups.ts">list</a>(packageId, { ...params }) -> GroupsV4PagePaginationArray</code>
- <code title="patch /zones/{zone_id}/firewall/waf/packages/{package_id}/groups/{group_id}">client.firewall.waf.packages.groups.<a href="./src/resources/firewall/waf/packages/groups.ts">edit</a>(packageId, groupId, { ...params }) -> GroupEditResponse</code>
- <code title="get /zones/{zone_id}/firewall/waf/packages/{package_id}/groups/{group_id}">client.firewall.waf.packages.groups.<a href="./src/resources/firewall/waf/packages/groups.ts">get</a>(packageId, groupId, { ...params }) -> GroupGetResponse</code>

#### Rules

Types:

- <code><a href="./src/resources/firewall/waf/packages/rules.ts">AllowedModesAnomaly</a></code>
- <code><a href="./src/resources/firewall/waf/packages/rules.ts">WAFRuleGroup</a></code>
- <code><a href="./src/resources/firewall/waf/packages/rules.ts">RuleListResponse</a></code>
- <code><a href="./src/resources/firewall/waf/packages/rules.ts">RuleEditResponse</a></code>
- <code><a href="./src/resources/firewall/waf/packages/rules.ts">RuleGetResponse</a></code>

Methods:

- <code title="get /zones/{zone_id}/firewall/waf/packages/{package_id}/rules">client.firewall.waf.packages.rules.<a href="./src/resources/firewall/waf/packages/rules.ts">list</a>(packageId, { ...params }) -> RuleListResponsesV4PagePaginationArray</code>
- <code title="patch /zones/{zone_id}/firewall/waf/packages/{package_id}/rules/{rule_id}">client.firewall.waf.packages.rules.<a href="./src/resources/firewall/waf/packages/rules.ts">edit</a>(packageId, ruleId, { ...params }) -> RuleEditResponse</code>
- <code title="get /zones/{zone_id}/firewall/waf/packages/{package_id}/rules/{rule_id}">client.firewall.waf.packages.rules.<a href="./src/resources/firewall/waf/packages/rules.ts">get</a>(packageId, ruleId, { ...params }) -> RuleGetResponse</code>

# Healthchecks

Types:

- <code><a href="./src/resources/healthchecks/healthchecks.ts">CheckRegion</a></code>
- <code><a href="./src/resources/healthchecks/healthchecks.ts">Healthcheck</a></code>
- <code><a href="./src/resources/healthchecks/healthchecks.ts">HTTPConfiguration</a></code>
- <code><a href="./src/resources/healthchecks/healthchecks.ts">QueryHealthcheck</a></code>
- <code><a href="./src/resources/healthchecks/healthchecks.ts">TCPConfiguration</a></code>
- <code><a href="./src/resources/healthchecks/healthchecks.ts">HealthcheckDeleteResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/healthchecks">client.healthchecks.<a href="./src/resources/healthchecks/healthchecks.ts">create</a>({ ...params }) -> Healthcheck</code>
- <code title="put /zones/{zone_id}/healthchecks/{healthcheck_id}">client.healthchecks.<a href="./src/resources/healthchecks/healthchecks.ts">update</a>(healthcheckId, { ...params }) -> Healthcheck</code>
- <code title="get /zones/{zone_id}/healthchecks">client.healthchecks.<a href="./src/resources/healthchecks/healthchecks.ts">list</a>({ ...params }) -> HealthchecksSinglePage</code>
- <code title="delete /zones/{zone_id}/healthchecks/{healthcheck_id}">client.healthchecks.<a href="./src/resources/healthchecks/healthchecks.ts">delete</a>(healthcheckId, { ...params }) -> HealthcheckDeleteResponse</code>
- <code title="patch /zones/{zone_id}/healthchecks/{healthcheck_id}">client.healthchecks.<a href="./src/resources/healthchecks/healthchecks.ts">edit</a>(healthcheckId, { ...params }) -> Healthcheck</code>
- <code title="get /zones/{zone_id}/healthchecks/{healthcheck_id}">client.healthchecks.<a href="./src/resources/healthchecks/healthchecks.ts">get</a>(healthcheckId, { ...params }) -> Healthcheck</code>

## Previews

Types:

- <code><a href="./src/resources/healthchecks/previews.ts">PreviewDeleteResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/healthchecks/preview">client.healthchecks.previews.<a href="./src/resources/healthchecks/previews.ts">create</a>({ ...params }) -> Healthcheck</code>
- <code title="delete /zones/{zone_id}/healthchecks/preview/{healthcheck_id}">client.healthchecks.previews.<a href="./src/resources/healthchecks/previews.ts">delete</a>(healthcheckId, { ...params }) -> PreviewDeleteResponse</code>
- <code title="get /zones/{zone_id}/healthchecks/preview/{healthcheck_id}">client.healthchecks.previews.<a href="./src/resources/healthchecks/previews.ts">get</a>(healthcheckId, { ...params }) -> Healthcheck</code>

# KeylessCertificates

Types:

- <code><a href="./src/resources/keyless-certificates.ts">KeylessCertificate</a></code>
- <code><a href="./src/resources/keyless-certificates.ts">Tunnel</a></code>
- <code><a href="./src/resources/keyless-certificates.ts">KeylessCertificateDeleteResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/keyless_certificates">client.keylessCertificates.<a href="./src/resources/keyless-certificates.ts">create</a>({ ...params }) -> KeylessCertificate</code>
- <code title="get /zones/{zone_id}/keyless_certificates">client.keylessCertificates.<a href="./src/resources/keyless-certificates.ts">list</a>({ ...params }) -> KeylessCertificatesSinglePage</code>
- <code title="delete /zones/{zone_id}/keyless_certificates/{keyless_certificate_id}">client.keylessCertificates.<a href="./src/resources/keyless-certificates.ts">delete</a>(keylessCertificateId, { ...params }) -> KeylessCertificateDeleteResponse</code>
- <code title="patch /zones/{zone_id}/keyless_certificates/{keyless_certificate_id}">client.keylessCertificates.<a href="./src/resources/keyless-certificates.ts">edit</a>(keylessCertificateId, { ...params }) -> KeylessCertificate</code>
- <code title="get /zones/{zone_id}/keyless_certificates/{keyless_certificate_id}">client.keylessCertificates.<a href="./src/resources/keyless-certificates.ts">get</a>(keylessCertificateId, { ...params }) -> KeylessCertificate</code>

# Logpush

## Datasets

### Fields

Types:

- <code><a href="./src/resources/logpush/datasets/fields.ts">FieldGetResponse</a></code>

Methods:

- <code title="get /{account_or_zone}/{account_or_zone_id}/logpush/datasets/{dataset_id}/fields">client.logpush.datasets.fields.<a href="./src/resources/logpush/datasets/fields.ts">get</a>(datasetId, { ...params }) -> FieldGetResponse</code>

### Jobs

Types:

- <code><a href="./src/resources/logpush/datasets/jobs.ts">JobGetResponse</a></code>

Methods:

- <code title="get /{account_or_zone}/{account_or_zone_id}/logpush/datasets/{dataset_id}/jobs">client.logpush.datasets.jobs.<a href="./src/resources/logpush/datasets/jobs.ts">get</a>(datasetId, { ...params }) -> JobGetResponse</code>

## Edge

Types:

- <code><a href="./src/resources/logpush/edge.ts">InstantLogpushJob</a></code>
- <code><a href="./src/resources/logpush/edge.ts">EdgeGetResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/logpush/edge">client.logpush.edge.<a href="./src/resources/logpush/edge.ts">create</a>({ ...params }) -> InstantLogpushJob | null</code>
- <code title="get /zones/{zone_id}/logpush/edge">client.logpush.edge.<a href="./src/resources/logpush/edge.ts">get</a>({ ...params }) -> EdgeGetResponse</code>

## Jobs

Types:

- <code><a href="./src/resources/logpush/jobs.ts">LogpushJob</a></code>
- <code><a href="./src/resources/logpush/jobs.ts">OutputOptions</a></code>
- <code><a href="./src/resources/logpush/jobs.ts">JobDeleteResponse</a></code>

Methods:

- <code title="post /{account_or_zone}/{account_or_zone_id}/logpush/jobs">client.logpush.jobs.<a href="./src/resources/logpush/jobs.ts">create</a>({ ...params }) -> LogpushJob | null</code>
- <code title="put /{account_or_zone}/{account_or_zone_id}/logpush/jobs/{job_id}">client.logpush.jobs.<a href="./src/resources/logpush/jobs.ts">update</a>(jobId, { ...params }) -> LogpushJob | null</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/logpush/jobs">client.logpush.jobs.<a href="./src/resources/logpush/jobs.ts">list</a>({ ...params }) -> LogpushJobsSinglePage</code>
- <code title="delete /{account_or_zone}/{account_or_zone_id}/logpush/jobs/{job_id}">client.logpush.jobs.<a href="./src/resources/logpush/jobs.ts">delete</a>(jobId, { ...params }) -> JobDeleteResponse | null</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/logpush/jobs/{job_id}">client.logpush.jobs.<a href="./src/resources/logpush/jobs.ts">get</a>(jobId, { ...params }) -> LogpushJob | null</code>

## Ownership

Types:

- <code><a href="./src/resources/logpush/ownership.ts">OwnershipValidation</a></code>
- <code><a href="./src/resources/logpush/ownership.ts">OwnershipCreateResponse</a></code>

Methods:

- <code title="post /{account_or_zone}/{account_or_zone_id}/logpush/ownership">client.logpush.ownership.<a href="./src/resources/logpush/ownership.ts">create</a>({ ...params }) -> OwnershipCreateResponse | null</code>
- <code title="post /{account_or_zone}/{account_or_zone_id}/logpush/ownership/validate">client.logpush.ownership.<a href="./src/resources/logpush/ownership.ts">validate</a>({ ...params }) -> OwnershipValidation | null</code>

## Validate

Types:

- <code><a href="./src/resources/logpush/validate.ts">ValidateDestinationResponse</a></code>
- <code><a href="./src/resources/logpush/validate.ts">ValidateOriginResponse</a></code>

Methods:

- <code title="post /{account_or_zone}/{account_or_zone_id}/logpush/validate/destination/exists">client.logpush.validate.<a href="./src/resources/logpush/validate.ts">destination</a>({ ...params }) -> ValidateDestinationResponse | null</code>
- <code title="post /{account_or_zone}/{account_or_zone_id}/logpush/validate/origin">client.logpush.validate.<a href="./src/resources/logpush/validate.ts">origin</a>({ ...params }) -> ValidateOriginResponse | null</code>

# Logs

## Control

### Retention

Types:

- <code><a href="./src/resources/logs/control/retention.ts">RetentionCreateResponse</a></code>
- <code><a href="./src/resources/logs/control/retention.ts">RetentionGetResponse</a></code>

Methods:

- <code title="post /zones/{zone_identifier}/logs/control/retention/flag">client.logs.control.retention.<a href="./src/resources/logs/control/retention.ts">create</a>(zoneIdentifier, { ...params }) -> RetentionCreateResponse</code>
- <code title="get /zones/{zone_identifier}/logs/control/retention/flag">client.logs.control.retention.<a href="./src/resources/logs/control/retention.ts">get</a>(zoneIdentifier) -> RetentionGetResponse</code>

### Cmb

#### Config

Types:

- <code><a href="./src/resources/logs/control/cmb/config.ts">CmbConfig</a></code>
- <code><a href="./src/resources/logs/control/cmb/config.ts">ConfigDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/logs/control/cmb/config">client.logs.control.cmb.config.<a href="./src/resources/logs/control/cmb/config.ts">create</a>({ ...params }) -> CmbConfig | null</code>
- <code title="delete /accounts/{account_id}/logs/control/cmb/config">client.logs.control.cmb.config.<a href="./src/resources/logs/control/cmb/config.ts">delete</a>({ ...params }) -> ConfigDeleteResponse | null</code>
- <code title="get /accounts/{account_id}/logs/control/cmb/config">client.logs.control.cmb.config.<a href="./src/resources/logs/control/cmb/config.ts">get</a>({ ...params }) -> CmbConfig | null</code>

## RayID

Types:

- <code><a href="./src/resources/logs/rayid.ts">RayIDGetResponse</a></code>

Methods:

- <code title="get /zones/{zone_identifier}/logs/rayids/{ray_identifier}">client.logs.RayID.<a href="./src/resources/logs/rayid.ts">get</a>(zoneIdentifier, rayIdentifier, { ...params }) -> RayIDGetResponse</code>

## Received

Types:

- <code><a href="./src/resources/logs/received/received.ts">ReceivedGetResponse</a></code>

Methods:

- <code title="get /zones/{zone_identifier}/logs/received">client.logs.received.<a href="./src/resources/logs/received/received.ts">get</a>(zoneIdentifier, { ...params }) -> ReceivedGetResponse</code>

### Fields

Types:

- <code><a href="./src/resources/logs/received/fields.ts">FieldGetResponse</a></code>

Methods:

- <code title="get /zones/{zone_identifier}/logs/received/fields">client.logs.received.fields.<a href="./src/resources/logs/received/fields.ts">get</a>(zoneIdentifier) -> FieldGetResponse</code>

# OriginTLSClientAuth

Types:

- <code><a href="./src/resources/origin-tls-client-auth/origin-tls-client-auth.ts">ZoneAuthenticatedOriginPull</a></code>
- <code><a href="./src/resources/origin-tls-client-auth/origin-tls-client-auth.ts">OriginTLSClientAuthCreateResponse</a></code>
- <code><a href="./src/resources/origin-tls-client-auth/origin-tls-client-auth.ts">OriginTLSClientAuthDeleteResponse</a></code>
- <code><a href="./src/resources/origin-tls-client-auth/origin-tls-client-auth.ts">OriginTLSClientAuthGetResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/origin_tls_client_auth">client.originTLSClientAuth.<a href="./src/resources/origin-tls-client-auth/origin-tls-client-auth.ts">create</a>({ ...params }) -> OriginTLSClientAuthCreateResponse</code>
- <code title="get /zones/{zone_id}/origin_tls_client_auth">client.originTLSClientAuth.<a href="./src/resources/origin-tls-client-auth/origin-tls-client-auth.ts">list</a>({ ...params }) -> ZoneAuthenticatedOriginPullsSinglePage</code>
- <code title="delete /zones/{zone_id}/origin_tls_client_auth/{certificate_id}">client.originTLSClientAuth.<a href="./src/resources/origin-tls-client-auth/origin-tls-client-auth.ts">delete</a>(certificateId, { ...params }) -> OriginTLSClientAuthDeleteResponse</code>
- <code title="get /zones/{zone_id}/origin_tls_client_auth/{certificate_id}">client.originTLSClientAuth.<a href="./src/resources/origin-tls-client-auth/origin-tls-client-auth.ts">get</a>(certificateId, { ...params }) -> OriginTLSClientAuthGetResponse</code>

## Hostnames

Types:

- <code><a href="./src/resources/origin-tls-client-auth/hostnames/hostnames.ts">AuthenticatedOriginPull</a></code>
- <code><a href="./src/resources/origin-tls-client-auth/hostnames/hostnames.ts">HostnameUpdateResponse</a></code>

Methods:

- <code title="put /zones/{zone_id}/origin_tls_client_auth/hostnames">client.originTLSClientAuth.hostnames.<a href="./src/resources/origin-tls-client-auth/hostnames/hostnames.ts">update</a>({ ...params }) -> HostnameUpdateResponse | null</code>
- <code title="get /zones/{zone_id}/origin_tls_client_auth/hostnames/{hostname}">client.originTLSClientAuth.hostnames.<a href="./src/resources/origin-tls-client-auth/hostnames/hostnames.ts">get</a>(hostname, { ...params }) -> AuthenticatedOriginPull</code>

### Certificates

Types:

- <code><a href="./src/resources/origin-tls-client-auth/hostnames/certificates.ts">Certificate</a></code>
- <code><a href="./src/resources/origin-tls-client-auth/hostnames/certificates.ts">CertificateCreateResponse</a></code>
- <code><a href="./src/resources/origin-tls-client-auth/hostnames/certificates.ts">CertificateDeleteResponse</a></code>
- <code><a href="./src/resources/origin-tls-client-auth/hostnames/certificates.ts">CertificateGetResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/origin_tls_client_auth/hostnames/certificates">client.originTLSClientAuth.hostnames.certificates.<a href="./src/resources/origin-tls-client-auth/hostnames/certificates.ts">create</a>({ ...params }) -> CertificateCreateResponse</code>
- <code title="get /zones/{zone_id}/origin_tls_client_auth/hostnames/certificates">client.originTLSClientAuth.hostnames.certificates.<a href="./src/resources/origin-tls-client-auth/hostnames/certificates.ts">list</a>({ ...params }) -> AuthenticatedOriginPullsSinglePage</code>
- <code title="delete /zones/{zone_id}/origin_tls_client_auth/hostnames/certificates/{certificate_id}">client.originTLSClientAuth.hostnames.certificates.<a href="./src/resources/origin-tls-client-auth/hostnames/certificates.ts">delete</a>(certificateId, { ...params }) -> CertificateDeleteResponse</code>
- <code title="get /zones/{zone_id}/origin_tls_client_auth/hostnames/certificates/{certificate_id}">client.originTLSClientAuth.hostnames.certificates.<a href="./src/resources/origin-tls-client-auth/hostnames/certificates.ts">get</a>(certificateId, { ...params }) -> CertificateGetResponse</code>

## Settings

Types:

- <code><a href="./src/resources/origin-tls-client-auth/settings.ts">SettingUpdateResponse</a></code>
- <code><a href="./src/resources/origin-tls-client-auth/settings.ts">SettingGetResponse</a></code>

Methods:

- <code title="put /zones/{zone_id}/origin_tls_client_auth/settings">client.originTLSClientAuth.settings.<a href="./src/resources/origin-tls-client-auth/settings.ts">update</a>({ ...params }) -> SettingUpdateResponse</code>
- <code title="get /zones/{zone_id}/origin_tls_client_auth/settings">client.originTLSClientAuth.settings.<a href="./src/resources/origin-tls-client-auth/settings.ts">get</a>({ ...params }) -> SettingGetResponse</code>

# Pagerules

Types:

- <code><a href="./src/resources/pagerules/pagerules.ts">PageRule</a></code>
- <code><a href="./src/resources/pagerules/pagerules.ts">Route</a></code>
- <code><a href="./src/resources/pagerules/pagerules.ts">Target</a></code>
- <code><a href="./src/resources/pagerules/pagerules.ts">PageruleCreateResponse</a></code>
- <code><a href="./src/resources/pagerules/pagerules.ts">PageruleUpdateResponse</a></code>
- <code><a href="./src/resources/pagerules/pagerules.ts">PageruleListResponse</a></code>
- <code><a href="./src/resources/pagerules/pagerules.ts">PageruleDeleteResponse</a></code>
- <code><a href="./src/resources/pagerules/pagerules.ts">PageruleEditResponse</a></code>
- <code><a href="./src/resources/pagerules/pagerules.ts">PageruleGetResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/pagerules">client.pagerules.<a href="./src/resources/pagerules/pagerules.ts">create</a>({ ...params }) -> PageruleCreateResponse</code>
- <code title="put /zones/{zone_id}/pagerules/{pagerule_id}">client.pagerules.<a href="./src/resources/pagerules/pagerules.ts">update</a>(pageruleId, { ...params }) -> PageruleUpdateResponse</code>
- <code title="get /zones/{zone_id}/pagerules">client.pagerules.<a href="./src/resources/pagerules/pagerules.ts">list</a>({ ...params }) -> PageruleListResponse</code>
- <code title="delete /zones/{zone_id}/pagerules/{pagerule_id}">client.pagerules.<a href="./src/resources/pagerules/pagerules.ts">delete</a>(pageruleId, { ...params }) -> PageruleDeleteResponse | null</code>
- <code title="patch /zones/{zone_id}/pagerules/{pagerule_id}">client.pagerules.<a href="./src/resources/pagerules/pagerules.ts">edit</a>(pageruleId, { ...params }) -> PageruleEditResponse</code>
- <code title="get /zones/{zone_id}/pagerules/{pagerule_id}">client.pagerules.<a href="./src/resources/pagerules/pagerules.ts">get</a>(pageruleId, { ...params }) -> PageruleGetResponse</code>

## Settings

Types:

- <code><a href="./src/resources/pagerules/settings.ts">SettingListResponse</a></code>

Methods:

- <code title="get /zones/{zone_id}/pagerules/settings">client.pagerules.settings.<a href="./src/resources/pagerules/settings.ts">list</a>({ ...params }) -> SettingListResponse</code>

# RateLimits

Types:

- <code><a href="./src/resources/rate-limits.ts">Action</a></code>
- <code><a href="./src/resources/rate-limits.ts">Methods</a></code>
- <code><a href="./src/resources/rate-limits.ts">RateLimit</a></code>
- <code><a href="./src/resources/rate-limits.ts">RateLimitCreateResponse</a></code>
- <code><a href="./src/resources/rate-limits.ts">RateLimitDeleteResponse</a></code>
- <code><a href="./src/resources/rate-limits.ts">RateLimitEditResponse</a></code>
- <code><a href="./src/resources/rate-limits.ts">RateLimitGetResponse</a></code>

Methods:

- <code title="post /zones/{zone_identifier}/rate_limits">client.rateLimits.<a href="./src/resources/rate-limits.ts">create</a>(zoneIdentifier, { ...params }) -> RateLimitCreateResponse</code>
- <code title="get /zones/{zone_identifier}/rate_limits">client.rateLimits.<a href="./src/resources/rate-limits.ts">list</a>(zoneIdentifier, { ...params }) -> RateLimitsV4PagePaginationArray</code>
- <code title="delete /zones/{zone_identifier}/rate_limits/{id}">client.rateLimits.<a href="./src/resources/rate-limits.ts">delete</a>(zoneIdentifier, id) -> RateLimitDeleteResponse</code>
- <code title="put /zones/{zone_identifier}/rate_limits/{id}">client.rateLimits.<a href="./src/resources/rate-limits.ts">edit</a>(zoneIdentifier, id, { ...params }) -> RateLimitEditResponse</code>
- <code title="get /zones/{zone_identifier}/rate_limits/{id}">client.rateLimits.<a href="./src/resources/rate-limits.ts">get</a>(zoneIdentifier, id) -> RateLimitGetResponse</code>

# SecondaryDNS

## ForceAXFR

Types:

- <code><a href="./src/resources/secondary-dns/force-axfr.ts">ForceAXFR</a></code>

Methods:

- <code title="post /zones/{zone_id}/secondary_dns/force_axfr">client.secondaryDNS.forceAXFR.<a href="./src/resources/secondary-dns/force-axfr.ts">create</a>({ ...params }) -> ForceAXFR</code>

## Incoming

Types:

- <code><a href="./src/resources/secondary-dns/incoming.ts">Incoming</a></code>
- <code><a href="./src/resources/secondary-dns/incoming.ts">IncomingCreateResponse</a></code>
- <code><a href="./src/resources/secondary-dns/incoming.ts">IncomingUpdateResponse</a></code>
- <code><a href="./src/resources/secondary-dns/incoming.ts">IncomingDeleteResponse</a></code>
- <code><a href="./src/resources/secondary-dns/incoming.ts">IncomingGetResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/secondary_dns/incoming">client.secondaryDNS.incoming.<a href="./src/resources/secondary-dns/incoming.ts">create</a>({ ...params }) -> IncomingCreateResponse</code>
- <code title="put /zones/{zone_id}/secondary_dns/incoming">client.secondaryDNS.incoming.<a href="./src/resources/secondary-dns/incoming.ts">update</a>({ ...params }) -> IncomingUpdateResponse</code>
- <code title="delete /zones/{zone_id}/secondary_dns/incoming">client.secondaryDNS.incoming.<a href="./src/resources/secondary-dns/incoming.ts">delete</a>({ ...params }) -> IncomingDeleteResponse</code>
- <code title="get /zones/{zone_id}/secondary_dns/incoming">client.secondaryDNS.incoming.<a href="./src/resources/secondary-dns/incoming.ts">get</a>({ ...params }) -> IncomingGetResponse</code>

## Outgoing

Types:

- <code><a href="./src/resources/secondary-dns/outgoing/outgoing.ts">DisableTransfer</a></code>
- <code><a href="./src/resources/secondary-dns/outgoing/outgoing.ts">EnableTransfer</a></code>
- <code><a href="./src/resources/secondary-dns/outgoing/outgoing.ts">Outgoing</a></code>
- <code><a href="./src/resources/secondary-dns/outgoing/outgoing.ts">OutgoingStatus</a></code>
- <code><a href="./src/resources/secondary-dns/outgoing/outgoing.ts">OutgoingCreateResponse</a></code>
- <code><a href="./src/resources/secondary-dns/outgoing/outgoing.ts">OutgoingUpdateResponse</a></code>
- <code><a href="./src/resources/secondary-dns/outgoing/outgoing.ts">OutgoingDeleteResponse</a></code>
- <code><a href="./src/resources/secondary-dns/outgoing/outgoing.ts">OutgoingForceNotifyResponse</a></code>
- <code><a href="./src/resources/secondary-dns/outgoing/outgoing.ts">OutgoingGetResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/secondary_dns/outgoing">client.secondaryDNS.outgoing.<a href="./src/resources/secondary-dns/outgoing/outgoing.ts">create</a>({ ...params }) -> OutgoingCreateResponse</code>
- <code title="put /zones/{zone_id}/secondary_dns/outgoing">client.secondaryDNS.outgoing.<a href="./src/resources/secondary-dns/outgoing/outgoing.ts">update</a>({ ...params }) -> OutgoingUpdateResponse</code>
- <code title="delete /zones/{zone_id}/secondary_dns/outgoing">client.secondaryDNS.outgoing.<a href="./src/resources/secondary-dns/outgoing/outgoing.ts">delete</a>({ ...params }) -> OutgoingDeleteResponse</code>
- <code title="post /zones/{zone_id}/secondary_dns/outgoing/disable">client.secondaryDNS.outgoing.<a href="./src/resources/secondary-dns/outgoing/outgoing.ts">disable</a>({ ...params }) -> DisableTransfer</code>
- <code title="post /zones/{zone_id}/secondary_dns/outgoing/enable">client.secondaryDNS.outgoing.<a href="./src/resources/secondary-dns/outgoing/outgoing.ts">enable</a>({ ...params }) -> EnableTransfer</code>
- <code title="post /zones/{zone_id}/secondary_dns/outgoing/force_notify">client.secondaryDNS.outgoing.<a href="./src/resources/secondary-dns/outgoing/outgoing.ts">forceNotify</a>({ ...params }) -> OutgoingForceNotifyResponse</code>
- <code title="get /zones/{zone_id}/secondary_dns/outgoing">client.secondaryDNS.outgoing.<a href="./src/resources/secondary-dns/outgoing/outgoing.ts">get</a>({ ...params }) -> OutgoingGetResponse</code>

### Status

Methods:

- <code title="get /zones/{zone_id}/secondary_dns/outgoing/status">client.secondaryDNS.outgoing.status.<a href="./src/resources/secondary-dns/outgoing/status.ts">get</a>({ ...params }) -> EnableTransfer</code>

## ACLs

Types:

- <code><a href="./src/resources/secondary-dns/acls.ts">ACL</a></code>
- <code><a href="./src/resources/secondary-dns/acls.ts">ACLDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/secondary_dns/acls">client.secondaryDNS.acls.<a href="./src/resources/secondary-dns/acls.ts">create</a>({ ...params }) -> ACL</code>
- <code title="put /accounts/{account_id}/secondary_dns/acls/{acl_id}">client.secondaryDNS.acls.<a href="./src/resources/secondary-dns/acls.ts">update</a>(aclId, { ...params }) -> ACL</code>
- <code title="get /accounts/{account_id}/secondary_dns/acls">client.secondaryDNS.acls.<a href="./src/resources/secondary-dns/acls.ts">list</a>({ ...params }) -> ACLsSinglePage</code>
- <code title="delete /accounts/{account_id}/secondary_dns/acls/{acl_id}">client.secondaryDNS.acls.<a href="./src/resources/secondary-dns/acls.ts">delete</a>(aclId, { ...params }) -> ACLDeleteResponse</code>
- <code title="get /accounts/{account_id}/secondary_dns/acls/{acl_id}">client.secondaryDNS.acls.<a href="./src/resources/secondary-dns/acls.ts">get</a>(aclId, { ...params }) -> ACL</code>

## Peers

Types:

- <code><a href="./src/resources/secondary-dns/peers.ts">Peer</a></code>
- <code><a href="./src/resources/secondary-dns/peers.ts">PeerDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/secondary_dns/peers">client.secondaryDNS.peers.<a href="./src/resources/secondary-dns/peers.ts">create</a>({ ...params }) -> Peer</code>
- <code title="put /accounts/{account_id}/secondary_dns/peers/{peer_id}">client.secondaryDNS.peers.<a href="./src/resources/secondary-dns/peers.ts">update</a>(peerId, { ...params }) -> Peer</code>
- <code title="get /accounts/{account_id}/secondary_dns/peers">client.secondaryDNS.peers.<a href="./src/resources/secondary-dns/peers.ts">list</a>({ ...params }) -> PeersSinglePage</code>
- <code title="delete /accounts/{account_id}/secondary_dns/peers/{peer_id}">client.secondaryDNS.peers.<a href="./src/resources/secondary-dns/peers.ts">delete</a>(peerId, { ...params }) -> PeerDeleteResponse</code>
- <code title="get /accounts/{account_id}/secondary_dns/peers/{peer_id}">client.secondaryDNS.peers.<a href="./src/resources/secondary-dns/peers.ts">get</a>(peerId, { ...params }) -> Peer</code>

## TSIGs

Types:

- <code><a href="./src/resources/secondary-dns/tsigs.ts">TSIG</a></code>
- <code><a href="./src/resources/secondary-dns/tsigs.ts">TSIGDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/secondary_dns/tsigs">client.secondaryDNS.tsigs.<a href="./src/resources/secondary-dns/tsigs.ts">create</a>({ ...params }) -> TSIG</code>
- <code title="put /accounts/{account_id}/secondary_dns/tsigs/{tsig_id}">client.secondaryDNS.tsigs.<a href="./src/resources/secondary-dns/tsigs.ts">update</a>(tsigId, { ...params }) -> TSIG</code>
- <code title="get /accounts/{account_id}/secondary_dns/tsigs">client.secondaryDNS.tsigs.<a href="./src/resources/secondary-dns/tsigs.ts">list</a>({ ...params }) -> TSIGsSinglePage</code>
- <code title="delete /accounts/{account_id}/secondary_dns/tsigs/{tsig_id}">client.secondaryDNS.tsigs.<a href="./src/resources/secondary-dns/tsigs.ts">delete</a>(tsigId, { ...params }) -> TSIGDeleteResponse</code>
- <code title="get /accounts/{account_id}/secondary_dns/tsigs/{tsig_id}">client.secondaryDNS.tsigs.<a href="./src/resources/secondary-dns/tsigs.ts">get</a>(tsigId, { ...params }) -> TSIG</code>

# WaitingRooms

Types:

- <code><a href="./src/resources/waiting-rooms/waiting-rooms.ts">AdditionalRoutes</a></code>
- <code><a href="./src/resources/waiting-rooms/waiting-rooms.ts">CookieAttributes</a></code>
- <code><a href="./src/resources/waiting-rooms/waiting-rooms.ts">Query</a></code>
- <code><a href="./src/resources/waiting-rooms/waiting-rooms.ts">WaitingRoom</a></code>
- <code><a href="./src/resources/waiting-rooms/waiting-rooms.ts">WaitingRoomDeleteResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/waiting_rooms">client.waitingRooms.<a href="./src/resources/waiting-rooms/waiting-rooms.ts">create</a>({ ...params }) -> WaitingRoom</code>
- <code title="put /zones/{zone_id}/waiting_rooms/{waiting_room_id}">client.waitingRooms.<a href="./src/resources/waiting-rooms/waiting-rooms.ts">update</a>(waitingRoomId, { ...params }) -> WaitingRoom</code>
- <code title="get /zones/{zone_id}/waiting_rooms">client.waitingRooms.<a href="./src/resources/waiting-rooms/waiting-rooms.ts">list</a>({ ...params }) -> WaitingRoomsSinglePage</code>
- <code title="delete /zones/{zone_id}/waiting_rooms/{waiting_room_id}">client.waitingRooms.<a href="./src/resources/waiting-rooms/waiting-rooms.ts">delete</a>(waitingRoomId, { ...params }) -> WaitingRoomDeleteResponse</code>
- <code title="patch /zones/{zone_id}/waiting_rooms/{waiting_room_id}">client.waitingRooms.<a href="./src/resources/waiting-rooms/waiting-rooms.ts">edit</a>(waitingRoomId, { ...params }) -> WaitingRoom</code>
- <code title="get /zones/{zone_id}/waiting_rooms/{waiting_room_id}">client.waitingRooms.<a href="./src/resources/waiting-rooms/waiting-rooms.ts">get</a>(waitingRoomId, { ...params }) -> WaitingRoom</code>

## Page

Types:

- <code><a href="./src/resources/waiting-rooms/page.ts">PagePreviewResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/waiting_rooms/preview">client.waitingRooms.page.<a href="./src/resources/waiting-rooms/page.ts">preview</a>({ ...params }) -> PagePreviewResponse</code>

## Events

Types:

- <code><a href="./src/resources/waiting-rooms/events/events.ts">Event</a></code>
- <code><a href="./src/resources/waiting-rooms/events/events.ts">EventDeleteResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/waiting_rooms/{waiting_room_id}/events">client.waitingRooms.events.<a href="./src/resources/waiting-rooms/events/events.ts">create</a>(waitingRoomId, { ...params }) -> Event</code>
- <code title="put /zones/{zone_id}/waiting_rooms/{waiting_room_id}/events/{event_id}">client.waitingRooms.events.<a href="./src/resources/waiting-rooms/events/events.ts">update</a>(waitingRoomId, eventId, { ...params }) -> Event</code>
- <code title="get /zones/{zone_id}/waiting_rooms/{waiting_room_id}/events">client.waitingRooms.events.<a href="./src/resources/waiting-rooms/events/events.ts">list</a>(waitingRoomId, { ...params }) -> EventsSinglePage</code>
- <code title="delete /zones/{zone_id}/waiting_rooms/{waiting_room_id}/events/{event_id}">client.waitingRooms.events.<a href="./src/resources/waiting-rooms/events/events.ts">delete</a>(waitingRoomId, eventId, { ...params }) -> EventDeleteResponse</code>
- <code title="patch /zones/{zone_id}/waiting_rooms/{waiting_room_id}/events/{event_id}">client.waitingRooms.events.<a href="./src/resources/waiting-rooms/events/events.ts">edit</a>(waitingRoomId, eventId, { ...params }) -> Event</code>
- <code title="get /zones/{zone_id}/waiting_rooms/{waiting_room_id}/events/{event_id}">client.waitingRooms.events.<a href="./src/resources/waiting-rooms/events/events.ts">get</a>(waitingRoomId, eventId, { ...params }) -> Event</code>

### Details

Types:

- <code><a href="./src/resources/waiting-rooms/events/details.ts">EventQuery</a></code>
- <code><a href="./src/resources/waiting-rooms/events/details.ts">DetailGetResponse</a></code>

Methods:

- <code title="get /zones/{zone_id}/waiting_rooms/{waiting_room_id}/events/{event_id}/details">client.waitingRooms.events.details.<a href="./src/resources/waiting-rooms/events/details.ts">get</a>(waitingRoomId, eventId, { ...params }) -> DetailGetResponse</code>

## Rules

Types:

- <code><a href="./src/resources/waiting-rooms/rules.ts">WaitingRoomRule</a></code>
- <code><a href="./src/resources/waiting-rooms/rules.ts">RuleCreateResponse</a></code>
- <code><a href="./src/resources/waiting-rooms/rules.ts">RuleUpdateResponse</a></code>
- <code><a href="./src/resources/waiting-rooms/rules.ts">RuleDeleteResponse</a></code>
- <code><a href="./src/resources/waiting-rooms/rules.ts">RuleEditResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/waiting_rooms/{waiting_room_id}/rules">client.waitingRooms.rules.<a href="./src/resources/waiting-rooms/rules.ts">create</a>(waitingRoomId, { ...params }) -> RuleCreateResponse | null</code>
- <code title="put /zones/{zone_id}/waiting_rooms/{waiting_room_id}/rules">client.waitingRooms.rules.<a href="./src/resources/waiting-rooms/rules.ts">update</a>(waitingRoomId, [ ...body ]) -> RuleUpdateResponse | null</code>
- <code title="get /zones/{zone_id}/waiting_rooms/{waiting_room_id}/rules">client.waitingRooms.rules.<a href="./src/resources/waiting-rooms/rules.ts">list</a>(waitingRoomId, { ...params }) -> WaitingRoomRulesSinglePage</code>
- <code title="delete /zones/{zone_id}/waiting_rooms/{waiting_room_id}/rules/{rule_id}">client.waitingRooms.rules.<a href="./src/resources/waiting-rooms/rules.ts">delete</a>(waitingRoomId, ruleId, { ...params }) -> RuleDeleteResponse | null</code>
- <code title="patch /zones/{zone_id}/waiting_rooms/{waiting_room_id}/rules/{rule_id}">client.waitingRooms.rules.<a href="./src/resources/waiting-rooms/rules.ts">edit</a>(waitingRoomId, ruleId, { ...params }) -> RuleEditResponse | null</code>

## Statuses

Types:

- <code><a href="./src/resources/waiting-rooms/statuses.ts">StatusGetResponse</a></code>

Methods:

- <code title="get /zones/{zone_id}/waiting_rooms/{waiting_room_id}/status">client.waitingRooms.statuses.<a href="./src/resources/waiting-rooms/statuses.ts">get</a>(waitingRoomId, { ...params }) -> StatusGetResponse</code>

## Settings

Types:

- <code><a href="./src/resources/waiting-rooms/settings.ts">Setting</a></code>
- <code><a href="./src/resources/waiting-rooms/settings.ts">SettingUpdateResponse</a></code>
- <code><a href="./src/resources/waiting-rooms/settings.ts">SettingEditResponse</a></code>
- <code><a href="./src/resources/waiting-rooms/settings.ts">SettingGetResponse</a></code>

Methods:

- <code title="put /zones/{zone_id}/waiting_rooms/settings">client.waitingRooms.settings.<a href="./src/resources/waiting-rooms/settings.ts">update</a>({ ...params }) -> SettingUpdateResponse</code>
- <code title="patch /zones/{zone_id}/waiting_rooms/settings">client.waitingRooms.settings.<a href="./src/resources/waiting-rooms/settings.ts">edit</a>({ ...params }) -> SettingEditResponse</code>
- <code title="get /zones/{zone_id}/waiting_rooms/settings">client.waitingRooms.settings.<a href="./src/resources/waiting-rooms/settings.ts">get</a>({ ...params }) -> SettingGetResponse</code>

# Web3

## Hostnames

Types:

- <code><a href="./src/resources/web3/hostnames/hostnames.ts">Hostname</a></code>
- <code><a href="./src/resources/web3/hostnames/hostnames.ts">HostnameDeleteResponse</a></code>

Methods:

- <code title="post /zones/{zone_identifier}/web3/hostnames">client.web3.hostnames.<a href="./src/resources/web3/hostnames/hostnames.ts">create</a>(zoneIdentifier, { ...params }) -> Hostname</code>
- <code title="get /zones/{zone_identifier}/web3/hostnames">client.web3.hostnames.<a href="./src/resources/web3/hostnames/hostnames.ts">list</a>(zoneIdentifier) -> HostnamesSinglePage</code>
- <code title="delete /zones/{zone_identifier}/web3/hostnames/{identifier}">client.web3.hostnames.<a href="./src/resources/web3/hostnames/hostnames.ts">delete</a>(zoneIdentifier, identifier) -> HostnameDeleteResponse | null</code>
- <code title="patch /zones/{zone_identifier}/web3/hostnames/{identifier}">client.web3.hostnames.<a href="./src/resources/web3/hostnames/hostnames.ts">edit</a>(zoneIdentifier, identifier, { ...params }) -> Hostname</code>
- <code title="get /zones/{zone_identifier}/web3/hostnames/{identifier}">client.web3.hostnames.<a href="./src/resources/web3/hostnames/hostnames.ts">get</a>(zoneIdentifier, identifier) -> Hostname</code>

### IPFSUniversalPaths

#### ContentLists

Types:

- <code><a href="./src/resources/web3/hostnames/ipfs-universal-paths/content-lists/content-lists.ts">ContentList</a></code>

Methods:

- <code title="put /zones/{zone_identifier}/web3/hostnames/{identifier}/ipfs_universal_path/content_list">client.web3.hostnames.ipfsUniversalPaths.contentLists.<a href="./src/resources/web3/hostnames/ipfs-universal-paths/content-lists/content-lists.ts">update</a>(zoneIdentifier, identifier, { ...params }) -> ContentList</code>
- <code title="get /zones/{zone_identifier}/web3/hostnames/{identifier}/ipfs_universal_path/content_list">client.web3.hostnames.ipfsUniversalPaths.contentLists.<a href="./src/resources/web3/hostnames/ipfs-universal-paths/content-lists/content-lists.ts">get</a>(zoneIdentifier, identifier) -> ContentList</code>

##### Entries

Types:

- <code><a href="./src/resources/web3/hostnames/ipfs-universal-paths/content-lists/entries.ts">EntryCreateResponse</a></code>
- <code><a href="./src/resources/web3/hostnames/ipfs-universal-paths/content-lists/entries.ts">EntryUpdateResponse</a></code>
- <code><a href="./src/resources/web3/hostnames/ipfs-universal-paths/content-lists/entries.ts">EntryListResponse</a></code>
- <code><a href="./src/resources/web3/hostnames/ipfs-universal-paths/content-lists/entries.ts">EntryDeleteResponse</a></code>
- <code><a href="./src/resources/web3/hostnames/ipfs-universal-paths/content-lists/entries.ts">EntryGetResponse</a></code>

Methods:

- <code title="post /zones/{zone_identifier}/web3/hostnames/{identifier}/ipfs_universal_path/content_list/entries">client.web3.hostnames.ipfsUniversalPaths.contentLists.entries.<a href="./src/resources/web3/hostnames/ipfs-universal-paths/content-lists/entries.ts">create</a>(zoneIdentifier, identifier, { ...params }) -> EntryCreateResponse</code>
- <code title="put /zones/{zone_identifier}/web3/hostnames/{identifier}/ipfs_universal_path/content_list/entries/{content_list_entry_identifier}">client.web3.hostnames.ipfsUniversalPaths.contentLists.entries.<a href="./src/resources/web3/hostnames/ipfs-universal-paths/content-lists/entries.ts">update</a>(zoneIdentifier, identifier, contentListEntryIdentifier, { ...params }) -> EntryUpdateResponse</code>
- <code title="get /zones/{zone_identifier}/web3/hostnames/{identifier}/ipfs_universal_path/content_list/entries">client.web3.hostnames.ipfsUniversalPaths.contentLists.entries.<a href="./src/resources/web3/hostnames/ipfs-universal-paths/content-lists/entries.ts">list</a>(zoneIdentifier, identifier) -> EntryListResponse | null</code>
- <code title="delete /zones/{zone_identifier}/web3/hostnames/{identifier}/ipfs_universal_path/content_list/entries/{content_list_entry_identifier}">client.web3.hostnames.ipfsUniversalPaths.contentLists.entries.<a href="./src/resources/web3/hostnames/ipfs-universal-paths/content-lists/entries.ts">delete</a>(zoneIdentifier, identifier, contentListEntryIdentifier) -> EntryDeleteResponse | null</code>
- <code title="get /zones/{zone_identifier}/web3/hostnames/{identifier}/ipfs_universal_path/content_list/entries/{content_list_entry_identifier}">client.web3.hostnames.ipfsUniversalPaths.contentLists.entries.<a href="./src/resources/web3/hostnames/ipfs-universal-paths/content-lists/entries.ts">get</a>(zoneIdentifier, identifier, contentListEntryIdentifier) -> EntryGetResponse</code>

# Workers

Types:

- <code><a href="./src/resources/workers/workers.ts">Binding</a></code>
- <code><a href="./src/resources/workers/workers.ts">D1Binding</a></code>
- <code><a href="./src/resources/workers/workers.ts">DispatchNamespaceBinding</a></code>
- <code><a href="./src/resources/workers/workers.ts">DurableObjectBinding</a></code>
- <code><a href="./src/resources/workers/workers.ts">KVNamespaceBinding</a></code>
- <code><a href="./src/resources/workers/workers.ts">MigrationStep</a></code>
- <code><a href="./src/resources/workers/workers.ts">MTLSCERTBinding</a></code>
- <code><a href="./src/resources/workers/workers.ts">PlacementConfiguration</a></code>
- <code><a href="./src/resources/workers/workers.ts">R2Binding</a></code>
- <code><a href="./src/resources/workers/workers.ts">ServiceBinding</a></code>
- <code><a href="./src/resources/workers/workers.ts">SingleStepMigration</a></code>
- <code><a href="./src/resources/workers/workers.ts">SteppedMigration</a></code>
- <code><a href="./src/resources/workers/workers.ts">WorkerMetadata</a></code>

## AI

Types:

- <code><a href="./src/resources/workers/ai/ai.ts">AIRunResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/ai/run/{model_name}">client.workers.ai.<a href="./src/resources/workers/ai/ai.ts">run</a>(modelName, { ...params }) -> AIRunResponse</code>

### Models

#### Schema

Types:

- <code><a href="./src/resources/workers/ai/models/schema.ts">SchemaGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/ai/models/schema">client.workers.ai.models.schema.<a href="./src/resources/workers/ai/models/schema.ts">get</a>({ ...params }) -> SchemaGetResponse</code>

## Scripts

Types:

- <code><a href="./src/resources/workers/scripts/scripts.ts">Script</a></code>
- <code><a href="./src/resources/workers/scripts/scripts.ts">ScriptSetting</a></code>

Methods:

- <code title="put /accounts/{account_id}/workers/scripts/{script_name}">client.workers.scripts.<a href="./src/resources/workers/scripts/scripts.ts">update</a>(scriptName, { ...params }) -> Script</code>
- <code title="get /accounts/{account_id}/workers/scripts">client.workers.scripts.<a href="./src/resources/workers/scripts/scripts.ts">list</a>({ ...params }) -> ScriptsSinglePage</code>
- <code title="delete /accounts/{account_id}/workers/scripts/{script_name}">client.workers.scripts.<a href="./src/resources/workers/scripts/scripts.ts">delete</a>(scriptName, { ...params }) -> void</code>
- <code title="get /accounts/{account_id}/workers/scripts/{script_name}">client.workers.scripts.<a href="./src/resources/workers/scripts/scripts.ts">get</a>(scriptName, { ...params }) -> Response</code>

### Schedules

Types:

- <code><a href="./src/resources/workers/scripts/schedules.ts">Schedule</a></code>
- <code><a href="./src/resources/workers/scripts/schedules.ts">ScheduleUpdateResponse</a></code>
- <code><a href="./src/resources/workers/scripts/schedules.ts">ScheduleGetResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/workers/scripts/{script_name}/schedules">client.workers.scripts.schedules.<a href="./src/resources/workers/scripts/schedules.ts">update</a>(scriptName, { ...params }) -> ScheduleUpdateResponse</code>
- <code title="get /accounts/{account_id}/workers/scripts/{script_name}/schedules">client.workers.scripts.schedules.<a href="./src/resources/workers/scripts/schedules.ts">get</a>(scriptName, { ...params }) -> ScheduleGetResponse</code>

### Tail

Types:

- <code><a href="./src/resources/workers/scripts/tail.ts">ConsumerScript</a></code>
- <code><a href="./src/resources/workers/scripts/tail.ts">TailCreateResponse</a></code>
- <code><a href="./src/resources/workers/scripts/tail.ts">TailDeleteResponse</a></code>
- <code><a href="./src/resources/workers/scripts/tail.ts">TailGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/workers/scripts/{script_name}/tails">client.workers.scripts.tail.<a href="./src/resources/workers/scripts/tail.ts">create</a>(scriptName, { ...params }) -> TailCreateResponse</code>
- <code title="delete /accounts/{account_id}/workers/scripts/{script_name}/tails/{id}">client.workers.scripts.tail.<a href="./src/resources/workers/scripts/tail.ts">delete</a>(scriptName, id, { ...params }) -> TailDeleteResponse</code>
- <code title="get /accounts/{account_id}/workers/scripts/{script_name}/tails">client.workers.scripts.tail.<a href="./src/resources/workers/scripts/tail.ts">get</a>(scriptName, { ...params }) -> TailGetResponse</code>

### Content

Methods:

- <code title="put /accounts/{account_id}/workers/scripts/{script_name}/content">client.workers.scripts.content.<a href="./src/resources/workers/scripts/content.ts">update</a>(scriptName, { ...params }) -> Script</code>
- <code title="get /accounts/{account_id}/workers/scripts/{script_name}/content/v2">client.workers.scripts.content.<a href="./src/resources/workers/scripts/content.ts">get</a>(scriptName, { ...params }) -> Response</code>

### Settings

Methods:

- <code title="patch /accounts/{account_id}/workers/scripts/{script_name}/script-settings">client.workers.scripts.settings.<a href="./src/resources/workers/scripts/settings.ts">edit</a>(scriptName, { ...params }) -> ScriptSetting</code>
- <code title="get /accounts/{account_id}/workers/scripts/{script_name}/script-settings">client.workers.scripts.settings.<a href="./src/resources/workers/scripts/settings.ts">get</a>(scriptName, { ...params }) -> ScriptSetting</code>

### Deployments

Types:

- <code><a href="./src/resources/workers/scripts/deployments.ts">Deployment</a></code>
- <code><a href="./src/resources/workers/scripts/deployments.ts">DeploymentCreateResponse</a></code>
- <code><a href="./src/resources/workers/scripts/deployments.ts">DeploymentGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/workers/scripts/{script_name}/deployments">client.workers.scripts.deployments.<a href="./src/resources/workers/scripts/deployments.ts">create</a>(scriptName, { ...params }) -> DeploymentCreateResponse</code>
- <code title="get /accounts/{account_id}/workers/scripts/{script_name}/deployments">client.workers.scripts.deployments.<a href="./src/resources/workers/scripts/deployments.ts">get</a>(scriptName, { ...params }) -> DeploymentGetResponse</code>

### Versions

Types:

- <code><a href="./src/resources/workers/scripts/versions.ts">VersionCreateResponse</a></code>
- <code><a href="./src/resources/workers/scripts/versions.ts">VersionListResponse</a></code>
- <code><a href="./src/resources/workers/scripts/versions.ts">VersionGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/workers/scripts/{script_name}/versions">client.workers.scripts.versions.<a href="./src/resources/workers/scripts/versions.ts">create</a>(scriptName, { ...params }) -> VersionCreateResponse</code>
- <code title="get /accounts/{account_id}/workers/scripts/{script_name}/versions">client.workers.scripts.versions.<a href="./src/resources/workers/scripts/versions.ts">list</a>(scriptName, { ...params }) -> VersionListResponsesV4PagePagination</code>
- <code title="get /accounts/{account_id}/workers/scripts/{script_name}/versions/{version_id}">client.workers.scripts.versions.<a href="./src/resources/workers/scripts/versions.ts">get</a>(scriptName, versionId, { ...params }) -> VersionGetResponse</code>

## AccountSettings

Types:

- <code><a href="./src/resources/workers/account-settings.ts">AccountSettingUpdateResponse</a></code>
- <code><a href="./src/resources/workers/account-settings.ts">AccountSettingGetResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/workers/account-settings">client.workers.accountSettings.<a href="./src/resources/workers/account-settings.ts">update</a>({ ...params }) -> AccountSettingUpdateResponse</code>
- <code title="get /accounts/{account_id}/workers/account-settings">client.workers.accountSettings.<a href="./src/resources/workers/account-settings.ts">get</a>({ ...params }) -> AccountSettingGetResponse</code>

## Domains

Types:

- <code><a href="./src/resources/workers/domains.ts">Domain</a></code>

Methods:

- <code title="put /accounts/{account_id}/workers/domains">client.workers.domains.<a href="./src/resources/workers/domains.ts">update</a>({ ...params }) -> Domain</code>
- <code title="get /accounts/{account_id}/workers/domains">client.workers.domains.<a href="./src/resources/workers/domains.ts">list</a>({ ...params }) -> DomainsSinglePage</code>
- <code title="delete /accounts/{account_id}/workers/domains/{domain_id}">client.workers.domains.<a href="./src/resources/workers/domains.ts">delete</a>(domainId, { ...params }) -> void</code>
- <code title="get /accounts/{account_id}/workers/domains/{domain_id}">client.workers.domains.<a href="./src/resources/workers/domains.ts">get</a>(domainId, { ...params }) -> Domain</code>

## Subdomains

Types:

- <code><a href="./src/resources/workers/subdomains.ts">SubdomainUpdateResponse</a></code>
- <code><a href="./src/resources/workers/subdomains.ts">SubdomainGetResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/workers/subdomain">client.workers.subdomains.<a href="./src/resources/workers/subdomains.ts">update</a>({ ...params }) -> SubdomainUpdateResponse</code>
- <code title="get /accounts/{account_id}/workers/subdomain">client.workers.subdomains.<a href="./src/resources/workers/subdomains.ts">get</a>({ ...params }) -> SubdomainGetResponse</code>

# KV

## Namespaces

Types:

- <code><a href="./src/resources/kv/namespaces/namespaces.ts">Namespace</a></code>
- <code><a href="./src/resources/kv/namespaces/namespaces.ts">NamespaceUpdateResponse</a></code>
- <code><a href="./src/resources/kv/namespaces/namespaces.ts">NamespaceDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/storage/kv/namespaces">client.kv.namespaces.<a href="./src/resources/kv/namespaces/namespaces.ts">create</a>({ ...params }) -> Namespace</code>
- <code title="put /accounts/{account_id}/storage/kv/namespaces/{namespace_id}">client.kv.namespaces.<a href="./src/resources/kv/namespaces/namespaces.ts">update</a>(namespaceId, { ...params }) -> NamespaceUpdateResponse | null</code>
- <code title="get /accounts/{account_id}/storage/kv/namespaces">client.kv.namespaces.<a href="./src/resources/kv/namespaces/namespaces.ts">list</a>({ ...params }) -> NamespacesV4PagePaginationArray</code>
- <code title="delete /accounts/{account_id}/storage/kv/namespaces/{namespace_id}">client.kv.namespaces.<a href="./src/resources/kv/namespaces/namespaces.ts">delete</a>(namespaceId, { ...params }) -> NamespaceDeleteResponse | null</code>
- <code title="get /accounts/{account_id}/storage/kv/namespaces/{namespace_id}">client.kv.namespaces.<a href="./src/resources/kv/namespaces/namespaces.ts">get</a>(namespaceId, { ...params }) -> Namespace</code>

### Bulk

Types:

- <code><a href="./src/resources/kv/namespaces/bulk.ts">BulkUpdateResponse</a></code>
- <code><a href="./src/resources/kv/namespaces/bulk.ts">BulkDeleteResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/storage/kv/namespaces/{namespace_id}/bulk">client.kv.namespaces.bulk.<a href="./src/resources/kv/namespaces/bulk.ts">update</a>(namespaceId, [ ...body ]) -> BulkUpdateResponse | null</code>
- <code title="delete /accounts/{account_id}/storage/kv/namespaces/{namespace_id}/bulk">client.kv.namespaces.bulk.<a href="./src/resources/kv/namespaces/bulk.ts">delete</a>(namespaceId, { ...params }) -> BulkDeleteResponse | null</code>

### Keys

Types:

- <code><a href="./src/resources/kv/namespaces/keys.ts">Key</a></code>

Methods:

- <code title="get /accounts/{account_id}/storage/kv/namespaces/{namespace_id}/keys">client.kv.namespaces.keys.<a href="./src/resources/kv/namespaces/keys.ts">list</a>(namespaceId, { ...params }) -> KeysCursorLimitPagination</code>

### Metadata

Types:

- <code><a href="./src/resources/kv/namespaces/metadata.ts">MetadataGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/storage/kv/namespaces/{namespace_id}/metadata/{key_name}">client.kv.namespaces.metadata.<a href="./src/resources/kv/namespaces/metadata.ts">get</a>(namespaceId, keyName, { ...params }) -> MetadataGetResponse</code>

### Values

Types:

- <code><a href="./src/resources/kv/namespaces/values.ts">ValueUpdateResponse</a></code>
- <code><a href="./src/resources/kv/namespaces/values.ts">ValueDeleteResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/storage/kv/namespaces/{namespace_id}/values/{key_name}">client.kv.namespaces.values.<a href="./src/resources/kv/namespaces/values.ts">update</a>(namespaceId, keyName, { ...params }) -> ValueUpdateResponse | null</code>
- <code title="delete /accounts/{account_id}/storage/kv/namespaces/{namespace_id}/values/{key_name}">client.kv.namespaces.values.<a href="./src/resources/kv/namespaces/values.ts">delete</a>(namespaceId, keyName, { ...params }) -> ValueDeleteResponse | null</code>
- <code title="get /accounts/{account_id}/storage/kv/namespaces/{namespace_id}/values/{key_name}">client.kv.namespaces.values.<a href="./src/resources/kv/namespaces/values.ts">get</a>(namespaceId, keyName, { ...params }) -> Response</code>

# DurableObjects

## Namespaces

Types:

- <code><a href="./src/resources/durable-objects/namespaces/namespaces.ts">Namespace</a></code>

Methods:

- <code title="get /accounts/{account_id}/workers/durable_objects/namespaces">client.durableObjects.namespaces.<a href="./src/resources/durable-objects/namespaces/namespaces.ts">list</a>({ ...params }) -> NamespacesSinglePage</code>

### Objects

Types:

- <code><a href="./src/resources/durable-objects/namespaces/objects.ts">DurableObject</a></code>

Methods:

- <code title="get /accounts/{account_id}/workers/durable_objects/namespaces/{id}/objects">client.durableObjects.namespaces.objects.<a href="./src/resources/durable-objects/namespaces/objects.ts">list</a>(id, { ...params }) -> DurableObjectsCursorLimitPagination</code>

# Queues

Types:

- <code><a href="./src/resources/queues/queues.ts">Queue</a></code>
- <code><a href="./src/resources/queues/queues.ts">QueueCreated</a></code>
- <code><a href="./src/resources/queues/queues.ts">QueueUpdated</a></code>
- <code><a href="./src/resources/queues/queues.ts">QueueDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/queues">client.queues.<a href="./src/resources/queues/queues.ts">create</a>({ ...params }) -> QueueCreated | null</code>
- <code title="put /accounts/{account_id}/queues/{queue_id}">client.queues.<a href="./src/resources/queues/queues.ts">update</a>(queueId, { ...params }) -> QueueUpdated | null</code>
- <code title="get /accounts/{account_id}/queues">client.queues.<a href="./src/resources/queues/queues.ts">list</a>({ ...params }) -> QueuesSinglePage</code>
- <code title="delete /accounts/{account_id}/queues/{queue_id}">client.queues.<a href="./src/resources/queues/queues.ts">delete</a>(queueId, { ...params }) -> QueueDeleteResponse | null</code>
- <code title="get /accounts/{account_id}/queues/{queue_id}">client.queues.<a href="./src/resources/queues/queues.ts">get</a>(queueId, { ...params }) -> Queue | null</code>

## Consumers

Types:

- <code><a href="./src/resources/queues/consumers.ts">Consumer</a></code>
- <code><a href="./src/resources/queues/consumers.ts">ConsumerCreateResponse</a></code>
- <code><a href="./src/resources/queues/consumers.ts">ConsumerUpdateResponse</a></code>
- <code><a href="./src/resources/queues/consumers.ts">ConsumerDeleteResponse</a></code>
- <code><a href="./src/resources/queues/consumers.ts">ConsumerGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/queues/{queue_id}/consumers">client.queues.consumers.<a href="./src/resources/queues/consumers.ts">create</a>(queueId, { ...params }) -> ConsumerCreateResponse | null</code>
- <code title="put /accounts/{account_id}/queues/{queue_id}/consumers/{consumer_id}">client.queues.consumers.<a href="./src/resources/queues/consumers.ts">update</a>(queueId, consumerId, { ...params }) -> ConsumerUpdateResponse | null</code>
- <code title="delete /accounts/{account_id}/queues/{queue_id}/consumers/{consumer_id}">client.queues.consumers.<a href="./src/resources/queues/consumers.ts">delete</a>(queueId, consumerId, { ...params }) -> ConsumerDeleteResponse | null</code>
- <code title="get /accounts/{account_id}/queues/{queue_id}/consumers">client.queues.consumers.<a href="./src/resources/queues/consumers.ts">get</a>(queueId, { ...params }) -> ConsumerGetResponse | null</code>

## Messages

Types:

- <code><a href="./src/resources/queues/messages.ts">MessageAckResponse</a></code>
- <code><a href="./src/resources/queues/messages.ts">MessagePullResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/queues/{queue_id}/messages/ack">client.queues.messages.<a href="./src/resources/queues/messages.ts">ack</a>(queueId, { ...params }) -> MessageAckResponse | null</code>
- <code title="post /accounts/{account_id}/queues/{queue_id}/messages/pull">client.queues.messages.<a href="./src/resources/queues/messages.ts">pull</a>(queueId, { ...params }) -> MessagePullResponse | null</code>

# APIGateway

## Configurations

Types:

- <code><a href="./src/resources/api-gateway/configurations.ts">Configuration</a></code>
- <code><a href="./src/resources/api-gateway/configurations.ts">ConfigurationUpdateResponse</a></code>

Methods:

- <code title="put /zones/{zone_id}/api_gateway/configuration">client.apiGateway.configurations.<a href="./src/resources/api-gateway/configurations.ts">update</a>({ ...params }) -> ConfigurationUpdateResponse</code>
- <code title="get /zones/{zone_id}/api_gateway/configuration">client.apiGateway.configurations.<a href="./src/resources/api-gateway/configurations.ts">get</a>({ ...params }) -> Configuration</code>

## Discovery

Types:

- <code><a href="./src/resources/api-gateway/discovery/discovery.ts">DiscoveryOperation</a></code>
- <code><a href="./src/resources/api-gateway/discovery/discovery.ts">DiscoveryGetResponse</a></code>

Methods:

- <code title="get /zones/{zone_id}/api_gateway/discovery">client.apiGateway.discovery.<a href="./src/resources/api-gateway/discovery/discovery.ts">get</a>({ ...params }) -> DiscoveryGetResponse</code>

### Operations

Types:

- <code><a href="./src/resources/api-gateway/discovery/operations.ts">OperationEditResponse</a></code>

Methods:

- <code title="get /zones/{zone_id}/api_gateway/discovery/operations">client.apiGateway.discovery.operations.<a href="./src/resources/api-gateway/discovery/operations.ts">list</a>({ ...params }) -> DiscoveryOperationsV4PagePaginationArray</code>
- <code title="patch /zones/{zone_id}/api_gateway/discovery/operations/{operation_id}">client.apiGateway.discovery.operations.<a href="./src/resources/api-gateway/discovery/operations.ts">edit</a>(operationId, { ...params }) -> OperationEditResponse</code>

## Operations

Types:

- <code><a href="./src/resources/api-gateway/operations/operations.ts">APIShield</a></code>
- <code><a href="./src/resources/api-gateway/operations/operations.ts">OperationCreateResponse</a></code>
- <code><a href="./src/resources/api-gateway/operations/operations.ts">OperationListResponse</a></code>
- <code><a href="./src/resources/api-gateway/operations/operations.ts">OperationDeleteResponse</a></code>
- <code><a href="./src/resources/api-gateway/operations/operations.ts">OperationGetResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/api_gateway/operations">client.apiGateway.operations.<a href="./src/resources/api-gateway/operations/operations.ts">create</a>([ ...body ]) -> OperationCreateResponse</code>
- <code title="get /zones/{zone_id}/api_gateway/operations">client.apiGateway.operations.<a href="./src/resources/api-gateway/operations/operations.ts">list</a>({ ...params }) -> OperationListResponsesV4PagePaginationArray</code>
- <code title="delete /zones/{zone_id}/api_gateway/operations/{operation_id}">client.apiGateway.operations.<a href="./src/resources/api-gateway/operations/operations.ts">delete</a>(operationId, { ...params }) -> OperationDeleteResponse</code>
- <code title="get /zones/{zone_id}/api_gateway/operations/{operation_id}">client.apiGateway.operations.<a href="./src/resources/api-gateway/operations/operations.ts">get</a>(operationId, { ...params }) -> OperationGetResponse</code>

### SchemaValidation

Types:

- <code><a href="./src/resources/api-gateway/operations/schema-validation.ts">SettingsMultipleRequest</a></code>
- <code><a href="./src/resources/api-gateway/operations/schema-validation.ts">SchemaValidationUpdateResponse</a></code>
- <code><a href="./src/resources/api-gateway/operations/schema-validation.ts">SchemaValidationGetResponse</a></code>

Methods:

- <code title="put /zones/{zone_id}/api_gateway/operations/{operation_id}/schema_validation">client.apiGateway.operations.schemaValidation.<a href="./src/resources/api-gateway/operations/schema-validation.ts">update</a>(operationId, { ...params }) -> SchemaValidationUpdateResponse</code>
- <code title="patch /zones/{zone_id}/api_gateway/operations/schema_validation">client.apiGateway.operations.schemaValidation.<a href="./src/resources/api-gateway/operations/schema-validation.ts">edit</a>({ ...params }) -> SettingsMultipleRequest</code>
- <code title="get /zones/{zone_id}/api_gateway/operations/{operation_id}/schema_validation">client.apiGateway.operations.schemaValidation.<a href="./src/resources/api-gateway/operations/schema-validation.ts">get</a>(operationId, { ...params }) -> SchemaValidationGetResponse</code>

## Schemas

Types:

- <code><a href="./src/resources/api-gateway/schemas.ts">SchemaListResponse</a></code>

Methods:

- <code title="get /zones/{zone_id}/api_gateway/schemas">client.apiGateway.schemas.<a href="./src/resources/api-gateway/schemas.ts">list</a>({ ...params }) -> SchemaListResponse</code>

## Settings

Types:

- <code><a href="./src/resources/api-gateway/settings/settings.ts">Settings</a></code>

### SchemaValidation

Methods:

- <code title="put /zones/{zone_id}/api_gateway/settings/schema_validation">client.apiGateway.settings.schemaValidation.<a href="./src/resources/api-gateway/settings/schema-validation.ts">update</a>({ ...params }) -> Settings</code>
- <code title="patch /zones/{zone_id}/api_gateway/settings/schema_validation">client.apiGateway.settings.schemaValidation.<a href="./src/resources/api-gateway/settings/schema-validation.ts">edit</a>({ ...params }) -> Settings</code>
- <code title="get /zones/{zone_id}/api_gateway/settings/schema_validation">client.apiGateway.settings.schemaValidation.<a href="./src/resources/api-gateway/settings/schema-validation.ts">get</a>({ ...params }) -> Settings</code>

## UserSchemas

Types:

- <code><a href="./src/resources/api-gateway/user-schemas/user-schemas.ts">Message</a></code>
- <code><a href="./src/resources/api-gateway/user-schemas/user-schemas.ts">PublicSchema</a></code>
- <code><a href="./src/resources/api-gateway/user-schemas/user-schemas.ts">SchemaUpload</a></code>
- <code><a href="./src/resources/api-gateway/user-schemas/user-schemas.ts">UserSchemaDeleteResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/api_gateway/user_schemas">client.apiGateway.userSchemas.<a href="./src/resources/api-gateway/user-schemas/user-schemas.ts">create</a>({ ...params }) -> SchemaUpload</code>
- <code title="get /zones/{zone_id}/api_gateway/user_schemas">client.apiGateway.userSchemas.<a href="./src/resources/api-gateway/user-schemas/user-schemas.ts">list</a>({ ...params }) -> PublicSchemasV4PagePaginationArray</code>
- <code title="delete /zones/{zone_id}/api_gateway/user_schemas/{schema_id}">client.apiGateway.userSchemas.<a href="./src/resources/api-gateway/user-schemas/user-schemas.ts">delete</a>(schemaId, { ...params }) -> UserSchemaDeleteResponse</code>
- <code title="patch /zones/{zone_id}/api_gateway/user_schemas/{schema_id}">client.apiGateway.userSchemas.<a href="./src/resources/api-gateway/user-schemas/user-schemas.ts">edit</a>(schemaId, { ...params }) -> PublicSchema</code>
- <code title="get /zones/{zone_id}/api_gateway/user_schemas/{schema_id}">client.apiGateway.userSchemas.<a href="./src/resources/api-gateway/user-schemas/user-schemas.ts">get</a>(schemaId, { ...params }) -> PublicSchema</code>

### Operations

Types:

- <code><a href="./src/resources/api-gateway/user-schemas/operations.ts">OperationListResponse</a></code>

Methods:

- <code title="get /zones/{zone_id}/api_gateway/user_schemas/{schema_id}/operations">client.apiGateway.userSchemas.operations.<a href="./src/resources/api-gateway/user-schemas/operations.ts">list</a>(schemaId, { ...params }) -> OperationListResponsesV4PagePaginationArray</code>

# ManagedHeaders

Types:

- <code><a href="./src/resources/managed-headers.ts">RequestModel</a></code>
- <code><a href="./src/resources/managed-headers.ts">ManagedHeaderListResponse</a></code>
- <code><a href="./src/resources/managed-headers.ts">ManagedHeaderEditResponse</a></code>

Methods:

- <code title="get /zones/{zone_id}/managed_headers">client.managedHeaders.<a href="./src/resources/managed-headers.ts">list</a>({ ...params }) -> ManagedHeaderListResponse</code>
- <code title="patch /zones/{zone_id}/managed_headers">client.managedHeaders.<a href="./src/resources/managed-headers.ts">edit</a>({ ...params }) -> ManagedHeaderEditResponse</code>

# PageShield

Types:

- <code><a href="./src/resources/page-shield/page-shield.ts">Setting</a></code>
- <code><a href="./src/resources/page-shield/page-shield.ts">PageShieldUpdateResponse</a></code>

Methods:

- <code title="put /zones/{zone_id}/page_shield">client.pageShield.<a href="./src/resources/page-shield/page-shield.ts">update</a>({ ...params }) -> PageShieldUpdateResponse</code>
- <code title="get /zones/{zone_id}/page_shield">client.pageShield.<a href="./src/resources/page-shield/page-shield.ts">get</a>({ ...params }) -> Setting | null</code>

## Policies

Types:

- <code><a href="./src/resources/page-shield/policies.ts">Policy</a></code>
- <code><a href="./src/resources/page-shield/policies.ts">PolicyCreateResponse</a></code>
- <code><a href="./src/resources/page-shield/policies.ts">PolicyUpdateResponse</a></code>
- <code><a href="./src/resources/page-shield/policies.ts">PolicyListResponse</a></code>
- <code><a href="./src/resources/page-shield/policies.ts">PolicyGetResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/page_shield/policies">client.pageShield.policies.<a href="./src/resources/page-shield/policies.ts">create</a>({ ...params }) -> PolicyCreateResponse | null</code>
- <code title="put /zones/{zone_id}/page_shield/policies/{policy_id}">client.pageShield.policies.<a href="./src/resources/page-shield/policies.ts">update</a>(policyId, { ...params }) -> PolicyUpdateResponse | null</code>
- <code title="get /zones/{zone_id}/page_shield/policies">client.pageShield.policies.<a href="./src/resources/page-shield/policies.ts">list</a>({ ...params }) -> PolicyListResponsesSinglePage</code>
- <code title="delete /zones/{zone_id}/page_shield/policies/{policy_id}">client.pageShield.policies.<a href="./src/resources/page-shield/policies.ts">delete</a>(policyId, { ...params }) -> void</code>
- <code title="get /zones/{zone_id}/page_shield/policies/{policy_id}">client.pageShield.policies.<a href="./src/resources/page-shield/policies.ts">get</a>(policyId, { ...params }) -> PolicyGetResponse | null</code>

## Connections

Types:

- <code><a href="./src/resources/page-shield/connections.ts">Connection</a></code>

Methods:

- <code title="get /zones/{zone_id}/page_shield/connections">client.pageShield.connections.<a href="./src/resources/page-shield/connections.ts">list</a>({ ...params }) -> ConnectionsSinglePage</code>
- <code title="get /zones/{zone_id}/page_shield/connections/{connection_id}">client.pageShield.connections.<a href="./src/resources/page-shield/connections.ts">get</a>(connectionId, { ...params }) -> Connection | null</code>

## Scripts

Types:

- <code><a href="./src/resources/page-shield/scripts.ts">Script</a></code>
- <code><a href="./src/resources/page-shield/scripts.ts">ScriptGetResponse</a></code>

Methods:

- <code title="get /zones/{zone_id}/page_shield/scripts">client.pageShield.scripts.<a href="./src/resources/page-shield/scripts.ts">list</a>({ ...params }) -> ScriptsSinglePage</code>
- <code title="get /zones/{zone_id}/page_shield/scripts/{script_id}">client.pageShield.scripts.<a href="./src/resources/page-shield/scripts.ts">get</a>(scriptId, { ...params }) -> ScriptGetResponse | null</code>

## Cookies

Types:

- <code><a href="./src/resources/page-shield/cookies.ts">CookieListResponse</a></code>
- <code><a href="./src/resources/page-shield/cookies.ts">CookieGetResponse</a></code>

Methods:

- <code title="get /zones/{zone_id}/page_shield/cookies">client.pageShield.cookies.<a href="./src/resources/page-shield/cookies.ts">list</a>({ ...params }) -> CookieListResponsesSinglePage</code>
- <code title="get /zones/{zone_id}/page_shield/cookies/{cookie_id}">client.pageShield.cookies.<a href="./src/resources/page-shield/cookies.ts">get</a>(cookieId, { ...params }) -> CookieGetResponse | null</code>

# Rulesets

Types:

- <code><a href="./src/resources/rulesets/rulesets.ts">Kind</a></code>
- <code><a href="./src/resources/rulesets/rulesets.ts">Phase</a></code>
- <code><a href="./src/resources/rulesets/rulesets.ts">Ruleset</a></code>
- <code><a href="./src/resources/rulesets/rulesets.ts">RulesetCreateResponse</a></code>
- <code><a href="./src/resources/rulesets/rulesets.ts">RulesetUpdateResponse</a></code>
- <code><a href="./src/resources/rulesets/rulesets.ts">RulesetListResponse</a></code>
- <code><a href="./src/resources/rulesets/rulesets.ts">RulesetGetResponse</a></code>

Methods:

- <code title="post /{account_or_zone}/{account_or_zone_id}/rulesets">client.rulesets.<a href="./src/resources/rulesets/rulesets.ts">create</a>({ ...params }) -> RulesetCreateResponse</code>
- <code title="put /{account_or_zone}/{account_or_zone_id}/rulesets/{ruleset_id}">client.rulesets.<a href="./src/resources/rulesets/rulesets.ts">update</a>(rulesetId, { ...params }) -> RulesetUpdateResponse</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/rulesets">client.rulesets.<a href="./src/resources/rulesets/rulesets.ts">list</a>({ ...params }) -> RulesetListResponsesSinglePage</code>
- <code title="delete /{account_or_zone}/{account_or_zone_id}/rulesets/{ruleset_id}">client.rulesets.<a href="./src/resources/rulesets/rulesets.ts">delete</a>(rulesetId, { ...params }) -> void</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/rulesets/{ruleset_id}">client.rulesets.<a href="./src/resources/rulesets/rulesets.ts">get</a>(rulesetId, { ...params }) -> RulesetGetResponse</code>

## Phases

Types:

- <code><a href="./src/resources/rulesets/phases/phases.ts">PhaseUpdateResponse</a></code>
- <code><a href="./src/resources/rulesets/phases/phases.ts">PhaseGetResponse</a></code>

Methods:

- <code title="put /{account_or_zone}/{account_or_zone_id}/rulesets/phases/{ruleset_phase}/entrypoint">client.rulesets.phases.<a href="./src/resources/rulesets/phases/phases.ts">update</a>(rulesetPhase, { ...params }) -> PhaseUpdateResponse</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/rulesets/phases/{ruleset_phase}/entrypoint">client.rulesets.phases.<a href="./src/resources/rulesets/phases/phases.ts">get</a>(rulesetPhase, { ...params }) -> PhaseGetResponse</code>

### Versions

Types:

- <code><a href="./src/resources/rulesets/phases/versions.ts">VersionListResponse</a></code>
- <code><a href="./src/resources/rulesets/phases/versions.ts">VersionGetResponse</a></code>

Methods:

- <code title="get /{account_or_zone}/{account_or_zone_id}/rulesets/phases/{ruleset_phase}/entrypoint/versions">client.rulesets.phases.versions.<a href="./src/resources/rulesets/phases/versions.ts">list</a>(rulesetPhase, { ...params }) -> VersionListResponsesSinglePage</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/rulesets/phases/{ruleset_phase}/entrypoint/versions/{ruleset_version}">client.rulesets.phases.versions.<a href="./src/resources/rulesets/phases/versions.ts">get</a>(rulesetPhase, rulesetVersion, { ...params }) -> VersionGetResponse</code>

## Rules

Types:

- <code><a href="./src/resources/rulesets/rules.ts">BlockRule</a></code>
- <code><a href="./src/resources/rulesets/rules.ts">ChallengeRule</a></code>
- <code><a href="./src/resources/rulesets/rules.ts">CompressResponseRule</a></code>
- <code><a href="./src/resources/rulesets/rules.ts">ExecuteRule</a></code>
- <code><a href="./src/resources/rulesets/rules.ts">JSChallengeRule</a></code>
- <code><a href="./src/resources/rulesets/rules.ts">LogRule</a></code>
- <code><a href="./src/resources/rulesets/rules.ts">Logging</a></code>
- <code><a href="./src/resources/rulesets/rules.ts">ManagedChallengeRule</a></code>
- <code><a href="./src/resources/rulesets/rules.ts">RedirectRule</a></code>
- <code><a href="./src/resources/rulesets/rules.ts">RewriteRule</a></code>
- <code><a href="./src/resources/rulesets/rules.ts">RewriteURIPart</a></code>
- <code><a href="./src/resources/rulesets/rules.ts">RouteRule</a></code>
- <code><a href="./src/resources/rulesets/rules.ts">RulesetRule</a></code>
- <code><a href="./src/resources/rulesets/rules.ts">ScoreRule</a></code>
- <code><a href="./src/resources/rulesets/rules.ts">ServeErrorRule</a></code>
- <code><a href="./src/resources/rulesets/rules.ts">SetCacheSettingsRule</a></code>
- <code><a href="./src/resources/rulesets/rules.ts">SetConfigRule</a></code>
- <code><a href="./src/resources/rulesets/rules.ts">SkipRule</a></code>
- <code><a href="./src/resources/rulesets/rules.ts">RuleCreateResponse</a></code>
- <code><a href="./src/resources/rulesets/rules.ts">RuleDeleteResponse</a></code>
- <code><a href="./src/resources/rulesets/rules.ts">RuleEditResponse</a></code>

Methods:

- <code title="post /{account_or_zone}/{account_or_zone_id}/rulesets/{ruleset_id}/rules">client.rulesets.rules.<a href="./src/resources/rulesets/rules.ts">create</a>(rulesetId, { ...params }) -> RuleCreateResponse</code>
- <code title="delete /{account_or_zone}/{account_or_zone_id}/rulesets/{ruleset_id}/rules/{rule_id}">client.rulesets.rules.<a href="./src/resources/rulesets/rules.ts">delete</a>(rulesetId, ruleId, { ...params }) -> RuleDeleteResponse</code>
- <code title="patch /{account_or_zone}/{account_or_zone_id}/rulesets/{ruleset_id}/rules/{rule_id}">client.rulesets.rules.<a href="./src/resources/rulesets/rules.ts">edit</a>(rulesetId, ruleId, { ...params }) -> RuleEditResponse</code>

## Versions

Types:

- <code><a href="./src/resources/rulesets/versions/versions.ts">VersionListResponse</a></code>
- <code><a href="./src/resources/rulesets/versions/versions.ts">VersionGetResponse</a></code>

Methods:

- <code title="get /{account_or_zone}/{account_or_zone_id}/rulesets/{ruleset_id}/versions">client.rulesets.versions.<a href="./src/resources/rulesets/versions/versions.ts">list</a>(rulesetId, { ...params }) -> VersionListResponsesSinglePage</code>
- <code title="delete /{account_or_zone}/{account_or_zone_id}/rulesets/{ruleset_id}/versions/{ruleset_version}">client.rulesets.versions.<a href="./src/resources/rulesets/versions/versions.ts">delete</a>(rulesetId, rulesetVersion, { ...params }) -> void</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/rulesets/{ruleset_id}/versions/{ruleset_version}">client.rulesets.versions.<a href="./src/resources/rulesets/versions/versions.ts">get</a>(rulesetId, rulesetVersion, { ...params }) -> VersionGetResponse</code>

### ByTag

Types:

- <code><a href="./src/resources/rulesets/versions/by-tag.ts">ByTagGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/rulesets/{ruleset_id}/versions/{ruleset_version}/by_tag/{rule_tag}">client.rulesets.versions.byTag.<a href="./src/resources/rulesets/versions/by-tag.ts">get</a>(rulesetId, rulesetVersion, ruleTag, { ...params }) -> ByTagGetResponse</code>

# URLNormalization

Types:

- <code><a href="./src/resources/url-normalization.ts">URLNormalizationUpdateResponse</a></code>
- <code><a href="./src/resources/url-normalization.ts">URLNormalizationGetResponse</a></code>

Methods:

- <code title="put /zones/{zone_id}/url_normalization">client.urlNormalization.<a href="./src/resources/url-normalization.ts">update</a>({ ...params }) -> URLNormalizationUpdateResponse</code>
- <code title="get /zones/{zone_id}/url_normalization">client.urlNormalization.<a href="./src/resources/url-normalization.ts">get</a>({ ...params }) -> URLNormalizationGetResponse</code>

# Spectrum

Types:

- <code><a href="./src/resources/spectrum/spectrum.ts">DNS</a></code>
- <code><a href="./src/resources/spectrum/spectrum.ts">EdgeIPs</a></code>
- <code><a href="./src/resources/spectrum/spectrum.ts">OriginDNS</a></code>
- <code><a href="./src/resources/spectrum/spectrum.ts">OriginPort</a></code>

## Analytics

### Aggregates

#### Currents

Types:

- <code><a href="./src/resources/spectrum/analytics/aggregates/currents.ts">CurrentGetResponse</a></code>

Methods:

- <code title="get /zones/{zone}/spectrum/analytics/aggregate/current">client.spectrum.analytics.aggregates.currents.<a href="./src/resources/spectrum/analytics/aggregates/currents.ts">get</a>(zone, { ...params }) -> CurrentGetResponse</code>

### Events

Types:

- <code><a href="./src/resources/spectrum/analytics/events/events.ts">Dimension</a></code>

#### Bytimes

Types:

- <code><a href="./src/resources/spectrum/analytics/events/bytimes.ts">BytimeGetResponse</a></code>

Methods:

- <code title="get /zones/{zone}/spectrum/analytics/events/bytime">client.spectrum.analytics.events.bytimes.<a href="./src/resources/spectrum/analytics/events/bytimes.ts">get</a>(zone, { ...params }) -> BytimeGetResponse | null</code>

#### Summaries

Types:

- <code><a href="./src/resources/spectrum/analytics/events/summaries.ts">SummaryGetResponse</a></code>

Methods:

- <code title="get /zones/{zone}/spectrum/analytics/events/summary">client.spectrum.analytics.events.summaries.<a href="./src/resources/spectrum/analytics/events/summaries.ts">get</a>(zone, { ...params }) -> SummaryGetResponse | null</code>

## Apps

Types:

- <code><a href="./src/resources/spectrum/apps.ts">AppCreateResponse</a></code>
- <code><a href="./src/resources/spectrum/apps.ts">AppUpdateResponse</a></code>
- <code><a href="./src/resources/spectrum/apps.ts">AppListResponse</a></code>
- <code><a href="./src/resources/spectrum/apps.ts">AppDeleteResponse</a></code>
- <code><a href="./src/resources/spectrum/apps.ts">AppGetResponse</a></code>

Methods:

- <code title="post /zones/{zone}/spectrum/apps">client.spectrum.apps.<a href="./src/resources/spectrum/apps.ts">create</a>(zone, { ...params }) -> AppCreateResponse | null</code>
- <code title="put /zones/{zone}/spectrum/apps/{app_id}">client.spectrum.apps.<a href="./src/resources/spectrum/apps.ts">update</a>(zone, appId, { ...params }) -> AppUpdateResponse | null</code>
- <code title="get /zones/{zone}/spectrum/apps">client.spectrum.apps.<a href="./src/resources/spectrum/apps.ts">list</a>(zone, { ...params }) -> AppListResponsesV4PagePaginationArray</code>
- <code title="delete /zones/{zone}/spectrum/apps/{app_id}">client.spectrum.apps.<a href="./src/resources/spectrum/apps.ts">delete</a>(zone, appId) -> AppDeleteResponse | null</code>
- <code title="get /zones/{zone}/spectrum/apps/{app_id}">client.spectrum.apps.<a href="./src/resources/spectrum/apps.ts">get</a>(zone, appId) -> AppGetResponse</code>

# Addressing

## RegionalHostnames

Types:

- <code><a href="./src/resources/addressing/regional-hostnames/regional-hostnames.ts">RegionalHostnameCreateResponse</a></code>
- <code><a href="./src/resources/addressing/regional-hostnames/regional-hostnames.ts">RegionalHostnameListResponse</a></code>
- <code><a href="./src/resources/addressing/regional-hostnames/regional-hostnames.ts">RegionalHostnameDeleteResponse</a></code>
- <code><a href="./src/resources/addressing/regional-hostnames/regional-hostnames.ts">RegionalHostnameEditResponse</a></code>
- <code><a href="./src/resources/addressing/regional-hostnames/regional-hostnames.ts">RegionalHostnameGetResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/addressing/regional_hostnames">client.addressing.regionalHostnames.<a href="./src/resources/addressing/regional-hostnames/regional-hostnames.ts">create</a>({ ...params }) -> RegionalHostnameCreateResponse</code>
- <code title="get /zones/{zone_id}/addressing/regional_hostnames">client.addressing.regionalHostnames.<a href="./src/resources/addressing/regional-hostnames/regional-hostnames.ts">list</a>({ ...params }) -> RegionalHostnameListResponsesSinglePage</code>
- <code title="delete /zones/{zone_id}/addressing/regional_hostnames/{hostname}">client.addressing.regionalHostnames.<a href="./src/resources/addressing/regional-hostnames/regional-hostnames.ts">delete</a>(hostname, { ...params }) -> RegionalHostnameDeleteResponse</code>
- <code title="patch /zones/{zone_id}/addressing/regional_hostnames/{hostname}">client.addressing.regionalHostnames.<a href="./src/resources/addressing/regional-hostnames/regional-hostnames.ts">edit</a>(hostname, { ...params }) -> RegionalHostnameEditResponse</code>
- <code title="get /zones/{zone_id}/addressing/regional_hostnames/{hostname}">client.addressing.regionalHostnames.<a href="./src/resources/addressing/regional-hostnames/regional-hostnames.ts">get</a>(hostname, { ...params }) -> RegionalHostnameGetResponse</code>

### Regions

Types:

- <code><a href="./src/resources/addressing/regional-hostnames/regions.ts">RegionListResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/addressing/regional_hostnames/regions">client.addressing.regionalHostnames.regions.<a href="./src/resources/addressing/regional-hostnames/regions.ts">list</a>({ ...params }) -> RegionListResponsesSinglePage</code>

## Services

Types:

- <code><a href="./src/resources/addressing/services.ts">ServiceListResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/addressing/services">client.addressing.services.<a href="./src/resources/addressing/services.ts">list</a>({ ...params }) -> ServiceListResponsesSinglePage</code>

## AddressMaps

Types:

- <code><a href="./src/resources/addressing/address-maps/address-maps.ts">AddressMap</a></code>
- <code><a href="./src/resources/addressing/address-maps/address-maps.ts">Kind</a></code>
- <code><a href="./src/resources/addressing/address-maps/address-maps.ts">AddressMapCreateResponse</a></code>
- <code><a href="./src/resources/addressing/address-maps/address-maps.ts">AddressMapDeleteResponse</a></code>
- <code><a href="./src/resources/addressing/address-maps/address-maps.ts">AddressMapGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/addressing/address_maps">client.addressing.addressMaps.<a href="./src/resources/addressing/address-maps/address-maps.ts">create</a>({ ...params }) -> AddressMapCreateResponse</code>
- <code title="get /accounts/{account_id}/addressing/address_maps">client.addressing.addressMaps.<a href="./src/resources/addressing/address-maps/address-maps.ts">list</a>({ ...params }) -> AddressMapsSinglePage</code>
- <code title="delete /accounts/{account_id}/addressing/address_maps/{address_map_id}">client.addressing.addressMaps.<a href="./src/resources/addressing/address-maps/address-maps.ts">delete</a>(addressMapId, { ...params }) -> AddressMapDeleteResponse | null</code>
- <code title="patch /accounts/{account_id}/addressing/address_maps/{address_map_id}">client.addressing.addressMaps.<a href="./src/resources/addressing/address-maps/address-maps.ts">edit</a>(addressMapId, { ...params }) -> AddressMap</code>
- <code title="get /accounts/{account_id}/addressing/address_maps/{address_map_id}">client.addressing.addressMaps.<a href="./src/resources/addressing/address-maps/address-maps.ts">get</a>(addressMapId, { ...params }) -> AddressMapGetResponse</code>

### Accounts

Types:

- <code><a href="./src/resources/addressing/address-maps/accounts.ts">AccountUpdateResponse</a></code>
- <code><a href="./src/resources/addressing/address-maps/accounts.ts">AccountDeleteResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/addressing/address_maps/{address_map_id}/accounts/{account_id}">client.addressing.addressMaps.accounts.<a href="./src/resources/addressing/address-maps/accounts.ts">update</a>(addressMapId, { ...params }) -> AccountUpdateResponse | null</code>
- <code title="delete /accounts/{account_id}/addressing/address_maps/{address_map_id}/accounts/{account_id}">client.addressing.addressMaps.accounts.<a href="./src/resources/addressing/address-maps/accounts.ts">delete</a>(addressMapId, { ...params }) -> AccountDeleteResponse | null</code>

### IPs

Types:

- <code><a href="./src/resources/addressing/address-maps/ips.ts">IPUpdateResponse</a></code>
- <code><a href="./src/resources/addressing/address-maps/ips.ts">IPDeleteResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/addressing/address_maps/{address_map_id}/ips/{ip_address}">client.addressing.addressMaps.ips.<a href="./src/resources/addressing/address-maps/ips.ts">update</a>(addressMapId, ipAddress, { ...params }) -> IPUpdateResponse | null</code>
- <code title="delete /accounts/{account_id}/addressing/address_maps/{address_map_id}/ips/{ip_address}">client.addressing.addressMaps.ips.<a href="./src/resources/addressing/address-maps/ips.ts">delete</a>(addressMapId, ipAddress, { ...params }) -> IPDeleteResponse | null</code>

### Zones

Types:

- <code><a href="./src/resources/addressing/address-maps/zones.ts">ZoneUpdateResponse</a></code>
- <code><a href="./src/resources/addressing/address-maps/zones.ts">ZoneDeleteResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/addressing/address_maps/{address_map_id}/zones/{zone_id}">client.addressing.addressMaps.zones.<a href="./src/resources/addressing/address-maps/zones.ts">update</a>(addressMapId, { ...params }) -> ZoneUpdateResponse | null</code>
- <code title="delete /accounts/{account_id}/addressing/address_maps/{address_map_id}/zones/{zone_id}">client.addressing.addressMaps.zones.<a href="./src/resources/addressing/address-maps/zones.ts">delete</a>(addressMapId, { ...params }) -> ZoneDeleteResponse | null</code>

## LOADocuments

Types:

- <code><a href="./src/resources/addressing/loa-documents/loa-documents.ts">LOADocumentCreateResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/addressing/loa_documents">client.addressing.loaDocuments.<a href="./src/resources/addressing/loa-documents/loa-documents.ts">create</a>({ ...params }) -> LOADocumentCreateResponse</code>

### Downloads

Methods:

- <code title="get /accounts/{account_id}/addressing/loa_documents/{loa_document_id}/download">client.addressing.loaDocuments.downloads.<a href="./src/resources/addressing/loa-documents/downloads.ts">get</a>(loaDocumentId, { ...params }) -> Response</code>

## Prefixes

Types:

- <code><a href="./src/resources/addressing/prefixes/prefixes.ts">Prefix</a></code>
- <code><a href="./src/resources/addressing/prefixes/prefixes.ts">PrefixDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/addressing/prefixes">client.addressing.prefixes.<a href="./src/resources/addressing/prefixes/prefixes.ts">create</a>({ ...params }) -> Prefix</code>
- <code title="get /accounts/{account_id}/addressing/prefixes">client.addressing.prefixes.<a href="./src/resources/addressing/prefixes/prefixes.ts">list</a>({ ...params }) -> PrefixesSinglePage</code>
- <code title="delete /accounts/{account_id}/addressing/prefixes/{prefix_id}">client.addressing.prefixes.<a href="./src/resources/addressing/prefixes/prefixes.ts">delete</a>(prefixId, { ...params }) -> PrefixDeleteResponse | null</code>
- <code title="patch /accounts/{account_id}/addressing/prefixes/{prefix_id}">client.addressing.prefixes.<a href="./src/resources/addressing/prefixes/prefixes.ts">edit</a>(prefixId, { ...params }) -> Prefix</code>
- <code title="get /accounts/{account_id}/addressing/prefixes/{prefix_id}">client.addressing.prefixes.<a href="./src/resources/addressing/prefixes/prefixes.ts">get</a>(prefixId, { ...params }) -> Prefix</code>

### BGP

#### Bindings

Types:

- <code><a href="./src/resources/addressing/prefixes/bgp/bindings.ts">ServiceBinding</a></code>
- <code><a href="./src/resources/addressing/prefixes/bgp/bindings.ts">BindingDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/addressing/prefixes/{prefix_id}/bindings">client.addressing.prefixes.bgp.bindings.<a href="./src/resources/addressing/prefixes/bgp/bindings.ts">create</a>(prefixId, { ...params }) -> ServiceBinding</code>
- <code title="get /accounts/{account_id}/addressing/prefixes/{prefix_id}/bindings">client.addressing.prefixes.bgp.bindings.<a href="./src/resources/addressing/prefixes/bgp/bindings.ts">list</a>(prefixId, { ...params }) -> ServiceBindingsSinglePage</code>
- <code title="delete /accounts/{account_id}/addressing/prefixes/{prefix_id}/bindings/{binding_id}">client.addressing.prefixes.bgp.bindings.<a href="./src/resources/addressing/prefixes/bgp/bindings.ts">delete</a>(prefixId, bindingId, { ...params }) -> BindingDeleteResponse</code>
- <code title="get /accounts/{account_id}/addressing/prefixes/{prefix_id}/bindings/{binding_id}">client.addressing.prefixes.bgp.bindings.<a href="./src/resources/addressing/prefixes/bgp/bindings.ts">get</a>(prefixId, bindingId, { ...params }) -> ServiceBinding</code>

#### Prefixes

Types:

- <code><a href="./src/resources/addressing/prefixes/bgp/prefixes.ts">BGPPrefix</a></code>

Methods:

- <code title="get /accounts/{account_id}/addressing/prefixes/{prefix_id}/bgp/prefixes">client.addressing.prefixes.bgp.prefixes.<a href="./src/resources/addressing/prefixes/bgp/prefixes.ts">list</a>(prefixId, { ...params }) -> BGPPrefixesSinglePage</code>
- <code title="patch /accounts/{account_id}/addressing/prefixes/{prefix_id}/bgp/prefixes/{bgp_prefix_id}">client.addressing.prefixes.bgp.prefixes.<a href="./src/resources/addressing/prefixes/bgp/prefixes.ts">edit</a>(prefixId, bgpPrefixId, { ...params }) -> BGPPrefix</code>
- <code title="get /accounts/{account_id}/addressing/prefixes/{prefix_id}/bgp/prefixes/{bgp_prefix_id}">client.addressing.prefixes.bgp.prefixes.<a href="./src/resources/addressing/prefixes/bgp/prefixes.ts">get</a>(prefixId, bgpPrefixId, { ...params }) -> BGPPrefix</code>

#### Statuses

Types:

- <code><a href="./src/resources/addressing/prefixes/bgp/statuses.ts">StatusEditResponse</a></code>
- <code><a href="./src/resources/addressing/prefixes/bgp/statuses.ts">StatusGetResponse</a></code>

Methods:

- <code title="patch /accounts/{account_id}/addressing/prefixes/{prefix_id}/bgp/status">client.addressing.prefixes.bgp.statuses.<a href="./src/resources/addressing/prefixes/bgp/statuses.ts">edit</a>(prefixId, { ...params }) -> StatusEditResponse</code>
- <code title="get /accounts/{account_id}/addressing/prefixes/{prefix_id}/bgp/status">client.addressing.prefixes.bgp.statuses.<a href="./src/resources/addressing/prefixes/bgp/statuses.ts">get</a>(prefixId, { ...params }) -> StatusGetResponse</code>

### Delegations

Types:

- <code><a href="./src/resources/addressing/prefixes/delegations.ts">Delegations</a></code>
- <code><a href="./src/resources/addressing/prefixes/delegations.ts">DelegationDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/addressing/prefixes/{prefix_id}/delegations">client.addressing.prefixes.delegations.<a href="./src/resources/addressing/prefixes/delegations.ts">create</a>(prefixId, { ...params }) -> Delegations</code>
- <code title="get /accounts/{account_id}/addressing/prefixes/{prefix_id}/delegations">client.addressing.prefixes.delegations.<a href="./src/resources/addressing/prefixes/delegations.ts">list</a>(prefixId, { ...params }) -> DelegationsSinglePage</code>
- <code title="delete /accounts/{account_id}/addressing/prefixes/{prefix_id}/delegations/{delegation_id}">client.addressing.prefixes.delegations.<a href="./src/resources/addressing/prefixes/delegations.ts">delete</a>(prefixId, delegationId, { ...params }) -> DelegationDeleteResponse</code>

# AuditLogs

Methods:

- <code title="get /accounts/{account_id}/audit_logs">client.auditLogs.<a href="./src/resources/audit-logs.ts">list</a>({ ...params }) -> AuditLogsV4PagePaginationArray</code>

# Billing

## Profiles

Types:

- <code><a href="./src/resources/billing/profiles.ts">ProfileGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_identifier}/billing/profile">client.billing.profiles.<a href="./src/resources/billing/profiles.ts">get</a>(accountIdentifier) -> ProfileGetResponse</code>

# BrandProtection

Types:

- <code><a href="./src/resources/brand-protection.ts">Info</a></code>
- <code><a href="./src/resources/brand-protection.ts">RuleMatch</a></code>
- <code><a href="./src/resources/brand-protection.ts">ScanStatus</a></code>
- <code><a href="./src/resources/brand-protection.ts">Submit</a></code>
- <code><a href="./src/resources/brand-protection.ts">URLInfoModelResults</a></code>

Methods:

- <code title="post /accounts/{account_id}/brand-protection/submit">client.brandProtection.<a href="./src/resources/brand-protection.ts">submit</a>({ ...params }) -> Submit</code>
- <code title="get /accounts/{account_id}/brand-protection/url-info">client.brandProtection.<a href="./src/resources/brand-protection.ts">urlInfo</a>({ ...params }) -> Info</code>

# Diagnostics

## Traceroutes

Types:

- <code><a href="./src/resources/diagnostics/traceroutes.ts">Traceroute</a></code>
- <code><a href="./src/resources/diagnostics/traceroutes.ts">TracerouteCreateResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/diagnostics/traceroute">client.diagnostics.traceroutes.<a href="./src/resources/diagnostics/traceroutes.ts">create</a>({ ...params }) -> TracerouteCreateResponse | null</code>

# Images

## V1

Types:

- <code><a href="./src/resources/images/v1/v1.ts">Image</a></code>
- <code><a href="./src/resources/images/v1/v1.ts">V1ListResponse</a></code>
- <code><a href="./src/resources/images/v1/v1.ts">V1DeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/images/v1">client.images.v1.<a href="./src/resources/images/v1/v1.ts">create</a>({ ...params }) -> Image</code>
- <code title="get /accounts/{account_id}/images/v1">client.images.v1.<a href="./src/resources/images/v1/v1.ts">list</a>({ ...params }) -> V1ListResponsesV4PagePagination</code>
- <code title="delete /accounts/{account_id}/images/v1/{image_id}">client.images.v1.<a href="./src/resources/images/v1/v1.ts">delete</a>(imageId, { ...params }) -> V1DeleteResponse</code>
- <code title="patch /accounts/{account_id}/images/v1/{image_id}">client.images.v1.<a href="./src/resources/images/v1/v1.ts">edit</a>(imageId, { ...params }) -> Image</code>
- <code title="get /accounts/{account_id}/images/v1/{image_id}">client.images.v1.<a href="./src/resources/images/v1/v1.ts">get</a>(imageId, { ...params }) -> Image</code>

### Keys

Types:

- <code><a href="./src/resources/images/v1/keys.ts">Key</a></code>
- <code><a href="./src/resources/images/v1/keys.ts">KeyUpdateResponse</a></code>
- <code><a href="./src/resources/images/v1/keys.ts">KeyListResponse</a></code>
- <code><a href="./src/resources/images/v1/keys.ts">KeyDeleteResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/images/v1/keys/{signing_key_name}">client.images.v1.keys.<a href="./src/resources/images/v1/keys.ts">update</a>(signingKeyName, { ...params }) -> KeyUpdateResponse</code>
- <code title="get /accounts/{account_id}/images/v1/keys">client.images.v1.keys.<a href="./src/resources/images/v1/keys.ts">list</a>({ ...params }) -> KeyListResponse</code>
- <code title="delete /accounts/{account_id}/images/v1/keys/{signing_key_name}">client.images.v1.keys.<a href="./src/resources/images/v1/keys.ts">delete</a>(signingKeyName, { ...params }) -> KeyDeleteResponse</code>

### Stats

Types:

- <code><a href="./src/resources/images/v1/stats.ts">Stat</a></code>

Methods:

- <code title="get /accounts/{account_id}/images/v1/stats">client.images.v1.stats.<a href="./src/resources/images/v1/stats.ts">get</a>({ ...params }) -> Stat</code>

### Variants

Types:

- <code><a href="./src/resources/images/v1/variants.ts">Variant</a></code>
- <code><a href="./src/resources/images/v1/variants.ts">VariantCreateResponse</a></code>
- <code><a href="./src/resources/images/v1/variants.ts">VariantDeleteResponse</a></code>
- <code><a href="./src/resources/images/v1/variants.ts">VariantEditResponse</a></code>
- <code><a href="./src/resources/images/v1/variants.ts">VariantGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/images/v1/variants">client.images.v1.variants.<a href="./src/resources/images/v1/variants.ts">create</a>({ ...params }) -> VariantCreateResponse</code>
- <code title="get /accounts/{account_id}/images/v1/variants">client.images.v1.variants.<a href="./src/resources/images/v1/variants.ts">list</a>({ ...params }) -> Variant</code>
- <code title="delete /accounts/{account_id}/images/v1/variants/{variant_id}">client.images.v1.variants.<a href="./src/resources/images/v1/variants.ts">delete</a>(variantId, { ...params }) -> VariantDeleteResponse</code>
- <code title="patch /accounts/{account_id}/images/v1/variants/{variant_id}">client.images.v1.variants.<a href="./src/resources/images/v1/variants.ts">edit</a>(variantId, { ...params }) -> VariantEditResponse</code>
- <code title="get /accounts/{account_id}/images/v1/variants/{variant_id}">client.images.v1.variants.<a href="./src/resources/images/v1/variants.ts">get</a>(variantId, { ...params }) -> VariantGetResponse</code>

### Blobs

Methods:

- <code title="get /accounts/{account_id}/images/v1/{image_id}/blob">client.images.v1.blobs.<a href="./src/resources/images/v1/blobs.ts">get</a>(imageId, { ...params }) -> Response</code>

## V2

Types:

- <code><a href="./src/resources/images/v2/v2.ts">V2ListResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/images/v2">client.images.v2.<a href="./src/resources/images/v2/v2.ts">list</a>({ ...params }) -> V2ListResponse</code>

### DirectUploads

Types:

- <code><a href="./src/resources/images/v2/direct-uploads.ts">DirectUploadCreateResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/images/v2/direct_upload">client.images.v2.directUploads.<a href="./src/resources/images/v2/direct-uploads.ts">create</a>({ ...params }) -> DirectUploadCreateResponse</code>

# Intel

## ASN

Methods:

- <code title="get /accounts/{account_id}/intel/asn/{asn}">client.intel.asn.<a href="./src/resources/intel/asn/asn.ts">get</a>(asn, { ...params }) -> ASN</code>

### Subnets

Types:

- <code><a href="./src/resources/intel/asn/subnets.ts">SubnetGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/intel/asn/{asn}/subnets">client.intel.asn.subnets.<a href="./src/resources/intel/asn/subnets.ts">get</a>(asn, { ...params }) -> SubnetGetResponse</code>

## DNS

Types:

- <code><a href="./src/resources/intel/dns.ts">DNS</a></code>
- <code><a href="./src/resources/intel/dns.ts">DNSListResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/intel/dns">client.intel.dns.<a href="./src/resources/intel/dns.ts">list</a>({ ...params }) -> DNSListResponsesV4PagePagination</code>

## Domains

Types:

- <code><a href="./src/resources/intel/domains/domains.ts">Domain</a></code>

Methods:

- <code title="get /accounts/{account_id}/intel/domain">client.intel.domains.<a href="./src/resources/intel/domains/domains.ts">get</a>({ ...params }) -> Domain</code>

### Bulks

Types:

- <code><a href="./src/resources/intel/domains/bulks.ts">BulkGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/intel/domain/bulk">client.intel.domains.bulks.<a href="./src/resources/intel/domains/bulks.ts">get</a>({ ...params }) -> BulkGetResponse | null</code>

## DomainHistory

Types:

- <code><a href="./src/resources/intel/domain-history.ts">DomainHistory</a></code>
- <code><a href="./src/resources/intel/domain-history.ts">DomainHistoryGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/intel/domain-history">client.intel.domainHistory.<a href="./src/resources/intel/domain-history.ts">get</a>({ ...params }) -> DomainHistoryGetResponse | null</code>

## IPs

Types:

- <code><a href="./src/resources/intel/ips.ts">IP</a></code>
- <code><a href="./src/resources/intel/ips.ts">IPGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/intel/ip">client.intel.ips.<a href="./src/resources/intel/ips.ts">get</a>({ ...params }) -> IPGetResponse | null</code>

## IPLists

Types:

- <code><a href="./src/resources/intel/ip-lists.ts">IPList</a></code>
- <code><a href="./src/resources/intel/ip-lists.ts">IPListGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/intel/ip-list">client.intel.ipLists.<a href="./src/resources/intel/ip-lists.ts">get</a>({ ...params }) -> IPListGetResponse | null</code>

## Miscategorizations

Types:

- <code><a href="./src/resources/intel/miscategorizations.ts">MiscategorizationCreateResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/intel/miscategorization">client.intel.miscategorizations.<a href="./src/resources/intel/miscategorizations.ts">create</a>({ ...params }) -> MiscategorizationCreateResponse</code>

## Whois

Types:

- <code><a href="./src/resources/intel/whois.ts">Whois</a></code>
- <code><a href="./src/resources/intel/whois.ts">WhoisGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/intel/whois">client.intel.whois.<a href="./src/resources/intel/whois.ts">get</a>({ ...params }) -> WhoisGetResponse</code>

## IndicatorFeeds

Types:

- <code><a href="./src/resources/intel/indicator-feeds/indicator-feeds.ts">IndicatorFeedCreateResponse</a></code>
- <code><a href="./src/resources/intel/indicator-feeds/indicator-feeds.ts">IndicatorFeedUpdateResponse</a></code>
- <code><a href="./src/resources/intel/indicator-feeds/indicator-feeds.ts">IndicatorFeedListResponse</a></code>
- <code><a href="./src/resources/intel/indicator-feeds/indicator-feeds.ts">IndicatorFeedDataResponse</a></code>
- <code><a href="./src/resources/intel/indicator-feeds/indicator-feeds.ts">IndicatorFeedGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/intel/indicator-feeds">client.intel.indicatorFeeds.<a href="./src/resources/intel/indicator-feeds/indicator-feeds.ts">create</a>({ ...params }) -> IndicatorFeedCreateResponse</code>
- <code title="put /accounts/{account_id}/intel/indicator-feeds/{feed_id}">client.intel.indicatorFeeds.<a href="./src/resources/intel/indicator-feeds/indicator-feeds.ts">update</a>(feedId, { ...params }) -> IndicatorFeedUpdateResponse</code>
- <code title="get /accounts/{account_id}/intel/indicator-feeds">client.intel.indicatorFeeds.<a href="./src/resources/intel/indicator-feeds/indicator-feeds.ts">list</a>({ ...params }) -> IndicatorFeedListResponsesSinglePage</code>
- <code title="get /accounts/{account_id}/intel/indicator-feeds/{feed_id}/data">client.intel.indicatorFeeds.<a href="./src/resources/intel/indicator-feeds/indicator-feeds.ts">data</a>(feedId, { ...params }) -> string</code>
- <code title="get /accounts/{account_id}/intel/indicator-feeds/{feed_id}">client.intel.indicatorFeeds.<a href="./src/resources/intel/indicator-feeds/indicator-feeds.ts">get</a>(feedId, { ...params }) -> IndicatorFeedGetResponse</code>

### Snapshots

Types:

- <code><a href="./src/resources/intel/indicator-feeds/snapshots.ts">SnapshotUpdateResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/intel/indicator-feeds/{feed_id}/snapshot">client.intel.indicatorFeeds.snapshots.<a href="./src/resources/intel/indicator-feeds/snapshots.ts">update</a>(feedId, { ...params }) -> SnapshotUpdateResponse</code>

### Permissions

Types:

- <code><a href="./src/resources/intel/indicator-feeds/permissions.ts">PermissionCreateResponse</a></code>
- <code><a href="./src/resources/intel/indicator-feeds/permissions.ts">PermissionListResponse</a></code>
- <code><a href="./src/resources/intel/indicator-feeds/permissions.ts">PermissionDeleteResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/intel/indicator-feeds/permissions/add">client.intel.indicatorFeeds.permissions.<a href="./src/resources/intel/indicator-feeds/permissions.ts">create</a>({ ...params }) -> PermissionCreateResponse</code>
- <code title="get /accounts/{account_id}/intel/indicator-feeds/permissions/view">client.intel.indicatorFeeds.permissions.<a href="./src/resources/intel/indicator-feeds/permissions.ts">list</a>({ ...params }) -> PermissionListResponse</code>
- <code title="put /accounts/{account_id}/intel/indicator-feeds/permissions/remove">client.intel.indicatorFeeds.permissions.<a href="./src/resources/intel/indicator-feeds/permissions.ts">delete</a>({ ...params }) -> PermissionDeleteResponse</code>

## Sinkholes

Types:

- <code><a href="./src/resources/intel/sinkholes.ts">Sinkhole</a></code>

Methods:

- <code title="get /accounts/{account_id}/intel/sinkholes">client.intel.sinkholes.<a href="./src/resources/intel/sinkholes.ts">list</a>({ ...params }) -> SinkholesSinglePage</code>

## AttackSurfaceReport

### IssueTypes

Types:

- <code><a href="./src/resources/intel/attack-surface-report/issue-types.ts">IssueTypeGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/intel/attack-surface-report/issue-types">client.intel.attackSurfaceReport.issueTypes.<a href="./src/resources/intel/attack-surface-report/issue-types.ts">get</a>({ ...params }) -> IssueTypeGetResponse</code>

### Issues

Types:

- <code><a href="./src/resources/intel/attack-surface-report/issues.ts">IssueType</a></code>
- <code><a href="./src/resources/intel/attack-surface-report/issues.ts">SeverityQueryParam</a></code>
- <code><a href="./src/resources/intel/attack-surface-report/issues.ts">IssueListResponse</a></code>
- <code><a href="./src/resources/intel/attack-surface-report/issues.ts">IssueClassResponse</a></code>
- <code><a href="./src/resources/intel/attack-surface-report/issues.ts">IssueDismissResponse</a></code>
- <code><a href="./src/resources/intel/attack-surface-report/issues.ts">IssueSeverityResponse</a></code>
- <code><a href="./src/resources/intel/attack-surface-report/issues.ts">IssueTypeResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/intel/attack-surface-report/issues">client.intel.attackSurfaceReport.issues.<a href="./src/resources/intel/attack-surface-report/issues.ts">list</a>({ ...params }) -> IssueListResponsesV4PagePagination</code>
- <code title="get /accounts/{account_id}/intel/attack-surface-report/issues/class">client.intel.attackSurfaceReport.issues.<a href="./src/resources/intel/attack-surface-report/issues.ts">class</a>({ ...params }) -> IssueClassResponse</code>
- <code title="put /accounts/{account_id}/intel/attack-surface-report/{issue_id}/dismiss">client.intel.attackSurfaceReport.issues.<a href="./src/resources/intel/attack-surface-report/issues.ts">dismiss</a>(issueId, { ...params }) -> IssueDismissResponse</code>
- <code title="get /accounts/{account_id}/intel/attack-surface-report/issues/severity">client.intel.attackSurfaceReport.issues.<a href="./src/resources/intel/attack-surface-report/issues.ts">severity</a>({ ...params }) -> IssueSeverityResponse</code>
- <code title="get /accounts/{account_id}/intel/attack-surface-report/issues/type">client.intel.attackSurfaceReport.issues.<a href="./src/resources/intel/attack-surface-report/issues.ts">type</a>({ ...params }) -> IssueTypeResponse</code>

# MagicTransit

Types:

- <code><a href="./src/resources/magic-transit/magic-transit.ts">HealthCheck</a></code>
- <code><a href="./src/resources/magic-transit/magic-transit.ts">HealthCheckRate</a></code>
- <code><a href="./src/resources/magic-transit/magic-transit.ts">HealthCheckType</a></code>

## Apps

Types:

- <code><a href="./src/resources/magic-transit/apps.ts">AppCreateResponse</a></code>
- <code><a href="./src/resources/magic-transit/apps.ts">AppUpdateResponse</a></code>
- <code><a href="./src/resources/magic-transit/apps.ts">AppListResponse</a></code>
- <code><a href="./src/resources/magic-transit/apps.ts">AppDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/magic/apps">client.magicTransit.apps.<a href="./src/resources/magic-transit/apps.ts">create</a>({ ...params }) -> AppCreateResponse | null</code>
- <code title="put /accounts/{account_id}/magic/apps/{account_app_id}">client.magicTransit.apps.<a href="./src/resources/magic-transit/apps.ts">update</a>(accountAppId, { ...params }) -> AppUpdateResponse | null</code>
- <code title="get /accounts/{account_id}/magic/apps">client.magicTransit.apps.<a href="./src/resources/magic-transit/apps.ts">list</a>({ ...params }) -> AppListResponsesSinglePage</code>
- <code title="delete /accounts/{account_id}/magic/apps/{account_app_id}">client.magicTransit.apps.<a href="./src/resources/magic-transit/apps.ts">delete</a>(accountAppId, { ...params }) -> AppDeleteResponse | null</code>

## CfInterconnects

Types:

- <code><a href="./src/resources/magic-transit/cf-interconnects.ts">CfInterconnectUpdateResponse</a></code>
- <code><a href="./src/resources/magic-transit/cf-interconnects.ts">CfInterconnectListResponse</a></code>
- <code><a href="./src/resources/magic-transit/cf-interconnects.ts">CfInterconnectGetResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/magic/cf_interconnects/{cf_interconnect_id}">client.magicTransit.cfInterconnects.<a href="./src/resources/magic-transit/cf-interconnects.ts">update</a>(cfInterconnectId, { ...params }) -> CfInterconnectUpdateResponse</code>
- <code title="get /accounts/{account_id}/magic/cf_interconnects">client.magicTransit.cfInterconnects.<a href="./src/resources/magic-transit/cf-interconnects.ts">list</a>({ ...params }) -> CfInterconnectListResponse</code>
- <code title="get /accounts/{account_id}/magic/cf_interconnects/{cf_interconnect_id}">client.magicTransit.cfInterconnects.<a href="./src/resources/magic-transit/cf-interconnects.ts">get</a>(cfInterconnectId, { ...params }) -> CfInterconnectGetResponse</code>

## GRETunnels

Types:

- <code><a href="./src/resources/magic-transit/gre-tunnels.ts">GRETunnelCreateResponse</a></code>
- <code><a href="./src/resources/magic-transit/gre-tunnels.ts">GRETunnelUpdateResponse</a></code>
- <code><a href="./src/resources/magic-transit/gre-tunnels.ts">GRETunnelListResponse</a></code>
- <code><a href="./src/resources/magic-transit/gre-tunnels.ts">GRETunnelDeleteResponse</a></code>
- <code><a href="./src/resources/magic-transit/gre-tunnels.ts">GRETunnelGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/magic/gre_tunnels">client.magicTransit.greTunnels.<a href="./src/resources/magic-transit/gre-tunnels.ts">create</a>({ ...params }) -> GRETunnelCreateResponse</code>
- <code title="put /accounts/{account_id}/magic/gre_tunnels/{gre_tunnel_id}">client.magicTransit.greTunnels.<a href="./src/resources/magic-transit/gre-tunnels.ts">update</a>(greTunnelId, { ...params }) -> GRETunnelUpdateResponse</code>
- <code title="get /accounts/{account_id}/magic/gre_tunnels">client.magicTransit.greTunnels.<a href="./src/resources/magic-transit/gre-tunnels.ts">list</a>({ ...params }) -> GRETunnelListResponse</code>
- <code title="delete /accounts/{account_id}/magic/gre_tunnels/{gre_tunnel_id}">client.magicTransit.greTunnels.<a href="./src/resources/magic-transit/gre-tunnels.ts">delete</a>(greTunnelId, { ...params }) -> GRETunnelDeleteResponse</code>
- <code title="get /accounts/{account_id}/magic/gre_tunnels/{gre_tunnel_id}">client.magicTransit.greTunnels.<a href="./src/resources/magic-transit/gre-tunnels.ts">get</a>(greTunnelId, { ...params }) -> GRETunnelGetResponse</code>

## IPSECTunnels

Types:

- <code><a href="./src/resources/magic-transit/ipsec-tunnels.ts">PSKMetadata</a></code>
- <code><a href="./src/resources/magic-transit/ipsec-tunnels.ts">IPSECTunnelCreateResponse</a></code>
- <code><a href="./src/resources/magic-transit/ipsec-tunnels.ts">IPSECTunnelUpdateResponse</a></code>
- <code><a href="./src/resources/magic-transit/ipsec-tunnels.ts">IPSECTunnelListResponse</a></code>
- <code><a href="./src/resources/magic-transit/ipsec-tunnels.ts">IPSECTunnelDeleteResponse</a></code>
- <code><a href="./src/resources/magic-transit/ipsec-tunnels.ts">IPSECTunnelGetResponse</a></code>
- <code><a href="./src/resources/magic-transit/ipsec-tunnels.ts">IPSECTunnelPSKGenerateResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/magic/ipsec_tunnels">client.magicTransit.ipsecTunnels.<a href="./src/resources/magic-transit/ipsec-tunnels.ts">create</a>({ ...params }) -> IPSECTunnelCreateResponse</code>
- <code title="put /accounts/{account_id}/magic/ipsec_tunnels/{ipsec_tunnel_id}">client.magicTransit.ipsecTunnels.<a href="./src/resources/magic-transit/ipsec-tunnels.ts">update</a>(ipsecTunnelId, { ...params }) -> IPSECTunnelUpdateResponse</code>
- <code title="get /accounts/{account_id}/magic/ipsec_tunnels">client.magicTransit.ipsecTunnels.<a href="./src/resources/magic-transit/ipsec-tunnels.ts">list</a>({ ...params }) -> IPSECTunnelListResponse</code>
- <code title="delete /accounts/{account_id}/magic/ipsec_tunnels/{ipsec_tunnel_id}">client.magicTransit.ipsecTunnels.<a href="./src/resources/magic-transit/ipsec-tunnels.ts">delete</a>(ipsecTunnelId, { ...params }) -> IPSECTunnelDeleteResponse</code>
- <code title="get /accounts/{account_id}/magic/ipsec_tunnels/{ipsec_tunnel_id}">client.magicTransit.ipsecTunnels.<a href="./src/resources/magic-transit/ipsec-tunnels.ts">get</a>(ipsecTunnelId, { ...params }) -> IPSECTunnelGetResponse</code>
- <code title="post /accounts/{account_id}/magic/ipsec_tunnels/{ipsec_tunnel_id}/psk_generate">client.magicTransit.ipsecTunnels.<a href="./src/resources/magic-transit/ipsec-tunnels.ts">pskGenerate</a>(ipsecTunnelId, { ...params }) -> IPSECTunnelPSKGenerateResponse</code>

## Routes

Types:

- <code><a href="./src/resources/magic-transit/routes.ts">Scope</a></code>
- <code><a href="./src/resources/magic-transit/routes.ts">RouteCreateResponse</a></code>
- <code><a href="./src/resources/magic-transit/routes.ts">RouteUpdateResponse</a></code>
- <code><a href="./src/resources/magic-transit/routes.ts">RouteListResponse</a></code>
- <code><a href="./src/resources/magic-transit/routes.ts">RouteDeleteResponse</a></code>
- <code><a href="./src/resources/magic-transit/routes.ts">RouteEmptyResponse</a></code>
- <code><a href="./src/resources/magic-transit/routes.ts">RouteGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/magic/routes">client.magicTransit.routes.<a href="./src/resources/magic-transit/routes.ts">create</a>({ ...params }) -> RouteCreateResponse</code>
- <code title="put /accounts/{account_id}/magic/routes/{route_id}">client.magicTransit.routes.<a href="./src/resources/magic-transit/routes.ts">update</a>(routeId, { ...params }) -> RouteUpdateResponse</code>
- <code title="get /accounts/{account_id}/magic/routes">client.magicTransit.routes.<a href="./src/resources/magic-transit/routes.ts">list</a>({ ...params }) -> RouteListResponse</code>
- <code title="delete /accounts/{account_id}/magic/routes/{route_id}">client.magicTransit.routes.<a href="./src/resources/magic-transit/routes.ts">delete</a>(routeId, { ...params }) -> RouteDeleteResponse</code>
- <code title="delete /accounts/{account_id}/magic/routes">client.magicTransit.routes.<a href="./src/resources/magic-transit/routes.ts">empty</a>({ ...params }) -> RouteEmptyResponse</code>
- <code title="get /accounts/{account_id}/magic/routes/{route_id}">client.magicTransit.routes.<a href="./src/resources/magic-transit/routes.ts">get</a>(routeId, { ...params }) -> RouteGetResponse</code>

## Sites

Types:

- <code><a href="./src/resources/magic-transit/sites/sites.ts">Site</a></code>
- <code><a href="./src/resources/magic-transit/sites/sites.ts">SiteLocation</a></code>

Methods:

- <code title="post /accounts/{account_id}/magic/sites">client.magicTransit.sites.<a href="./src/resources/magic-transit/sites/sites.ts">create</a>({ ...params }) -> Site</code>
- <code title="put /accounts/{account_id}/magic/sites/{site_id}">client.magicTransit.sites.<a href="./src/resources/magic-transit/sites/sites.ts">update</a>(siteId, { ...params }) -> Site</code>
- <code title="get /accounts/{account_id}/magic/sites">client.magicTransit.sites.<a href="./src/resources/magic-transit/sites/sites.ts">list</a>({ ...params }) -> SitesSinglePage</code>
- <code title="delete /accounts/{account_id}/magic/sites/{site_id}">client.magicTransit.sites.<a href="./src/resources/magic-transit/sites/sites.ts">delete</a>(siteId, { ...params }) -> Site</code>
- <code title="patch /accounts/{account_id}/magic/sites/{site_id}">client.magicTransit.sites.<a href="./src/resources/magic-transit/sites/sites.ts">edit</a>(siteId, { ...params }) -> Site</code>
- <code title="get /accounts/{account_id}/magic/sites/{site_id}">client.magicTransit.sites.<a href="./src/resources/magic-transit/sites/sites.ts">get</a>(siteId, { ...params }) -> Site</code>

### ACLs

Types:

- <code><a href="./src/resources/magic-transit/sites/acls.ts">ACL</a></code>
- <code><a href="./src/resources/magic-transit/sites/acls.ts">ACLConfiguration</a></code>
- <code><a href="./src/resources/magic-transit/sites/acls.ts">AllowedProtocol</a></code>
- <code><a href="./src/resources/magic-transit/sites/acls.ts">Subnet</a></code>

Methods:

- <code title="post /accounts/{account_id}/magic/sites/{site_id}/acls">client.magicTransit.sites.acls.<a href="./src/resources/magic-transit/sites/acls.ts">create</a>(siteId, { ...params }) -> ACL</code>
- <code title="put /accounts/{account_id}/magic/sites/{site_id}/acls/{acl_id}">client.magicTransit.sites.acls.<a href="./src/resources/magic-transit/sites/acls.ts">update</a>(siteId, aclId, { ...params }) -> ACL</code>
- <code title="get /accounts/{account_id}/magic/sites/{site_id}/acls">client.magicTransit.sites.acls.<a href="./src/resources/magic-transit/sites/acls.ts">list</a>(siteId, { ...params }) -> ACLsSinglePage</code>
- <code title="delete /accounts/{account_id}/magic/sites/{site_id}/acls/{acl_id}">client.magicTransit.sites.acls.<a href="./src/resources/magic-transit/sites/acls.ts">delete</a>(siteId, aclId, { ...params }) -> ACL</code>
- <code title="patch /accounts/{account_id}/magic/sites/{site_id}/acls/{acl_id}">client.magicTransit.sites.acls.<a href="./src/resources/magic-transit/sites/acls.ts">edit</a>(siteId, aclId, { ...params }) -> ACL</code>
- <code title="get /accounts/{account_id}/magic/sites/{site_id}/acls/{acl_id}">client.magicTransit.sites.acls.<a href="./src/resources/magic-transit/sites/acls.ts">get</a>(siteId, aclId, { ...params }) -> ACL</code>

### LANs

Types:

- <code><a href="./src/resources/magic-transit/sites/lans.ts">DHCPRelay</a></code>
- <code><a href="./src/resources/magic-transit/sites/lans.ts">DHCPServer</a></code>
- <code><a href="./src/resources/magic-transit/sites/lans.ts">LAN</a></code>
- <code><a href="./src/resources/magic-transit/sites/lans.ts">LANStaticAddressing</a></code>
- <code><a href="./src/resources/magic-transit/sites/lans.ts">Nat</a></code>
- <code><a href="./src/resources/magic-transit/sites/lans.ts">RoutedSubnet</a></code>
- <code><a href="./src/resources/magic-transit/sites/lans.ts">LANCreateResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/magic/sites/{site_id}/lans">client.magicTransit.sites.lans.<a href="./src/resources/magic-transit/sites/lans.ts">create</a>(siteId, { ...params }) -> LANCreateResponse</code>
- <code title="put /accounts/{account_id}/magic/sites/{site_id}/lans/{lan_id}">client.magicTransit.sites.lans.<a href="./src/resources/magic-transit/sites/lans.ts">update</a>(siteId, lanId, { ...params }) -> LAN</code>
- <code title="get /accounts/{account_id}/magic/sites/{site_id}/lans">client.magicTransit.sites.lans.<a href="./src/resources/magic-transit/sites/lans.ts">list</a>(siteId, { ...params }) -> LANsSinglePage</code>
- <code title="delete /accounts/{account_id}/magic/sites/{site_id}/lans/{lan_id}">client.magicTransit.sites.lans.<a href="./src/resources/magic-transit/sites/lans.ts">delete</a>(siteId, lanId, { ...params }) -> LAN</code>
- <code title="patch /accounts/{account_id}/magic/sites/{site_id}/lans/{lan_id}">client.magicTransit.sites.lans.<a href="./src/resources/magic-transit/sites/lans.ts">edit</a>(siteId, lanId, { ...params }) -> LAN</code>
- <code title="get /accounts/{account_id}/magic/sites/{site_id}/lans/{lan_id}">client.magicTransit.sites.lans.<a href="./src/resources/magic-transit/sites/lans.ts">get</a>(siteId, lanId, { ...params }) -> LAN</code>

### WANs

Types:

- <code><a href="./src/resources/magic-transit/sites/wans.ts">WAN</a></code>
- <code><a href="./src/resources/magic-transit/sites/wans.ts">WANStaticAddressing</a></code>
- <code><a href="./src/resources/magic-transit/sites/wans.ts">WANCreateResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/magic/sites/{site_id}/wans">client.magicTransit.sites.wans.<a href="./src/resources/magic-transit/sites/wans.ts">create</a>(siteId, { ...params }) -> WANCreateResponse</code>
- <code title="put /accounts/{account_id}/magic/sites/{site_id}/wans/{wan_id}">client.magicTransit.sites.wans.<a href="./src/resources/magic-transit/sites/wans.ts">update</a>(siteId, wanId, { ...params }) -> WAN</code>
- <code title="get /accounts/{account_id}/magic/sites/{site_id}/wans">client.magicTransit.sites.wans.<a href="./src/resources/magic-transit/sites/wans.ts">list</a>(siteId, { ...params }) -> WANsSinglePage</code>
- <code title="delete /accounts/{account_id}/magic/sites/{site_id}/wans/{wan_id}">client.magicTransit.sites.wans.<a href="./src/resources/magic-transit/sites/wans.ts">delete</a>(siteId, wanId, { ...params }) -> WAN</code>
- <code title="patch /accounts/{account_id}/magic/sites/{site_id}/wans/{wan_id}">client.magicTransit.sites.wans.<a href="./src/resources/magic-transit/sites/wans.ts">edit</a>(siteId, wanId, { ...params }) -> WAN</code>
- <code title="get /accounts/{account_id}/magic/sites/{site_id}/wans/{wan_id}">client.magicTransit.sites.wans.<a href="./src/resources/magic-transit/sites/wans.ts">get</a>(siteId, wanId, { ...params }) -> WAN</code>

## Connectors

Types:

- <code><a href="./src/resources/magic-transit/connectors.ts">ConnectorUpdateResponse</a></code>
- <code><a href="./src/resources/magic-transit/connectors.ts">ConnectorListResponse</a></code>
- <code><a href="./src/resources/magic-transit/connectors.ts">ConnectorEditResponse</a></code>
- <code><a href="./src/resources/magic-transit/connectors.ts">ConnectorGetResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/magic/connectors/{connector_id}">client.magicTransit.connectors.<a href="./src/resources/magic-transit/connectors.ts">update</a>(connectorId, { ...params }) -> ConnectorUpdateResponse</code>
- <code title="get /accounts/{account_id}/magic/connectors">client.magicTransit.connectors.<a href="./src/resources/magic-transit/connectors.ts">list</a>({ ...params }) -> ConnectorListResponsesSinglePage</code>
- <code title="patch /accounts/{account_id}/magic/connectors/{connector_id}">client.magicTransit.connectors.<a href="./src/resources/magic-transit/connectors.ts">edit</a>(connectorId, { ...params }) -> ConnectorEditResponse</code>
- <code title="get /accounts/{account_id}/magic/connectors/{connector_id}">client.magicTransit.connectors.<a href="./src/resources/magic-transit/connectors.ts">get</a>(connectorId, { ...params }) -> ConnectorGetResponse</code>

# MagicNetworkMonitoring

## Configs

Types:

- <code><a href="./src/resources/magic-network-monitoring/configs/configs.ts">Configuration</a></code>

Methods:

- <code title="post /accounts/{account_id}/mnm/config">client.magicNetworkMonitoring.configs.<a href="./src/resources/magic-network-monitoring/configs/configs.ts">create</a>({ ...params }) -> Configuration</code>
- <code title="put /accounts/{account_id}/mnm/config">client.magicNetworkMonitoring.configs.<a href="./src/resources/magic-network-monitoring/configs/configs.ts">update</a>({ ...params }) -> Configuration</code>
- <code title="delete /accounts/{account_id}/mnm/config">client.magicNetworkMonitoring.configs.<a href="./src/resources/magic-network-monitoring/configs/configs.ts">delete</a>({ ...params }) -> Configuration</code>
- <code title="patch /accounts/{account_id}/mnm/config">client.magicNetworkMonitoring.configs.<a href="./src/resources/magic-network-monitoring/configs/configs.ts">edit</a>({ ...params }) -> Configuration</code>
- <code title="get /accounts/{account_id}/mnm/config">client.magicNetworkMonitoring.configs.<a href="./src/resources/magic-network-monitoring/configs/configs.ts">get</a>({ ...params }) -> Configuration</code>

### Full

Methods:

- <code title="get /accounts/{account_id}/mnm/config/full">client.magicNetworkMonitoring.configs.full.<a href="./src/resources/magic-network-monitoring/configs/full.ts">get</a>({ ...params }) -> Configuration</code>

## Rules

Types:

- <code><a href="./src/resources/magic-network-monitoring/rules/rules.ts">MagicNetworkMonitoringRule</a></code>

Methods:

- <code title="post /accounts/{account_id}/mnm/rules">client.magicNetworkMonitoring.rules.<a href="./src/resources/magic-network-monitoring/rules/rules.ts">create</a>({ ...params }) -> MagicNetworkMonitoringRule | null</code>
- <code title="put /accounts/{account_id}/mnm/rules">client.magicNetworkMonitoring.rules.<a href="./src/resources/magic-network-monitoring/rules/rules.ts">update</a>({ ...params }) -> MagicNetworkMonitoringRule | null</code>
- <code title="get /accounts/{account_id}/mnm/rules">client.magicNetworkMonitoring.rules.<a href="./src/resources/magic-network-monitoring/rules/rules.ts">list</a>({ ...params }) -> MagicNetworkMonitoringRulesSinglePage</code>
- <code title="delete /accounts/{account_id}/mnm/rules/{rule_id}">client.magicNetworkMonitoring.rules.<a href="./src/resources/magic-network-monitoring/rules/rules.ts">delete</a>(ruleId, { ...params }) -> MagicNetworkMonitoringRule | null</code>
- <code title="patch /accounts/{account_id}/mnm/rules/{rule_id}">client.magicNetworkMonitoring.rules.<a href="./src/resources/magic-network-monitoring/rules/rules.ts">edit</a>(ruleId, { ...params }) -> MagicNetworkMonitoringRule | null</code>
- <code title="get /accounts/{account_id}/mnm/rules/{rule_id}">client.magicNetworkMonitoring.rules.<a href="./src/resources/magic-network-monitoring/rules/rules.ts">get</a>(ruleId, { ...params }) -> MagicNetworkMonitoringRule | null</code>

### Advertisements

Types:

- <code><a href="./src/resources/magic-network-monitoring/rules/advertisements.ts">Advertisement</a></code>

Methods:

- <code title="patch /accounts/{account_id}/mnm/rules/{rule_id}/advertisement">client.magicNetworkMonitoring.rules.advertisements.<a href="./src/resources/magic-network-monitoring/rules/advertisements.ts">edit</a>(ruleId, { ...params }) -> Advertisement | null</code>

# MTLSCertificates

Types:

- <code><a href="./src/resources/mtls-certificates/mtls-certificates.ts">MTLSCertificate</a></code>
- <code><a href="./src/resources/mtls-certificates/mtls-certificates.ts">MTLSCertificateCreateResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/mtls_certificates">client.mtlsCertificates.<a href="./src/resources/mtls-certificates/mtls-certificates.ts">create</a>({ ...params }) -> MTLSCertificateCreateResponse</code>
- <code title="get /accounts/{account_id}/mtls_certificates">client.mtlsCertificates.<a href="./src/resources/mtls-certificates/mtls-certificates.ts">list</a>({ ...params }) -> MTLSCertificatesSinglePage</code>
- <code title="delete /accounts/{account_id}/mtls_certificates/{mtls_certificate_id}">client.mtlsCertificates.<a href="./src/resources/mtls-certificates/mtls-certificates.ts">delete</a>(mtlsCertificateId, { ...params }) -> MTLSCertificate</code>
- <code title="get /accounts/{account_id}/mtls_certificates/{mtls_certificate_id}">client.mtlsCertificates.<a href="./src/resources/mtls-certificates/mtls-certificates.ts">get</a>(mtlsCertificateId, { ...params }) -> MTLSCertificate</code>

## Associations

Types:

- <code><a href="./src/resources/mtls-certificates/associations.ts">CertificateAsssociation</a></code>
- <code><a href="./src/resources/mtls-certificates/associations.ts">AssociationGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/mtls_certificates/{mtls_certificate_id}/associations">client.mtlsCertificates.associations.<a href="./src/resources/mtls-certificates/associations.ts">get</a>(mtlsCertificateId, { ...params }) -> AssociationGetResponse | null</code>

# Pages

## Projects

Types:

- <code><a href="./src/resources/pages/projects/projects.ts">Deployment</a></code>
- <code><a href="./src/resources/pages/projects/projects.ts">Project</a></code>
- <code><a href="./src/resources/pages/projects/projects.ts">Stage</a></code>
- <code><a href="./src/resources/pages/projects/projects.ts">ProjectCreateResponse</a></code>
- <code><a href="./src/resources/pages/projects/projects.ts">ProjectDeleteResponse</a></code>
- <code><a href="./src/resources/pages/projects/projects.ts">ProjectEditResponse</a></code>
- <code><a href="./src/resources/pages/projects/projects.ts">ProjectPurgeBuildCacheResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/pages/projects">client.pages.projects.<a href="./src/resources/pages/projects/projects.ts">create</a>({ ...params }) -> ProjectCreateResponse</code>
- <code title="get /accounts/{account_id}/pages/projects">client.pages.projects.<a href="./src/resources/pages/projects/projects.ts">list</a>({ ...params }) -> DeploymentsSinglePage</code>
- <code title="delete /accounts/{account_id}/pages/projects/{project_name}">client.pages.projects.<a href="./src/resources/pages/projects/projects.ts">delete</a>(projectName, { ...params }) -> unknown</code>
- <code title="patch /accounts/{account_id}/pages/projects/{project_name}">client.pages.projects.<a href="./src/resources/pages/projects/projects.ts">edit</a>(projectName, { ...params }) -> ProjectEditResponse</code>
- <code title="get /accounts/{account_id}/pages/projects/{project_name}">client.pages.projects.<a href="./src/resources/pages/projects/projects.ts">get</a>(projectName, { ...params }) -> Project</code>
- <code title="post /accounts/{account_id}/pages/projects/{project_name}/purge_build_cache">client.pages.projects.<a href="./src/resources/pages/projects/projects.ts">purgeBuildCache</a>(projectName, { ...params }) -> unknown</code>

### Deployments

Types:

- <code><a href="./src/resources/pages/projects/deployments/deployments.ts">DeploymentDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/pages/projects/{project_name}/deployments">client.pages.projects.deployments.<a href="./src/resources/pages/projects/deployments/deployments.ts">create</a>(projectName, { ...params }) -> Deployment</code>
- <code title="get /accounts/{account_id}/pages/projects/{project_name}/deployments">client.pages.projects.deployments.<a href="./src/resources/pages/projects/deployments/deployments.ts">list</a>(projectName, { ...params }) -> DeploymentsSinglePage</code>
- <code title="delete /accounts/{account_id}/pages/projects/{project_name}/deployments/{deployment_id}">client.pages.projects.deployments.<a href="./src/resources/pages/projects/deployments/deployments.ts">delete</a>(projectName, deploymentId, { ...params }) -> unknown</code>
- <code title="get /accounts/{account_id}/pages/projects/{project_name}/deployments/{deployment_id}">client.pages.projects.deployments.<a href="./src/resources/pages/projects/deployments/deployments.ts">get</a>(projectName, deploymentId, { ...params }) -> Deployment</code>
- <code title="post /accounts/{account_id}/pages/projects/{project_name}/deployments/{deployment_id}/retry">client.pages.projects.deployments.<a href="./src/resources/pages/projects/deployments/deployments.ts">retry</a>(projectName, deploymentId, { ...params }) -> Deployment</code>
- <code title="post /accounts/{account_id}/pages/projects/{project_name}/deployments/{deployment_id}/rollback">client.pages.projects.deployments.<a href="./src/resources/pages/projects/deployments/deployments.ts">rollback</a>(projectName, deploymentId, { ...params }) -> Deployment</code>

#### History

##### Logs

Types:

- <code><a href="./src/resources/pages/projects/deployments/history/logs.ts">LogGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/pages/projects/{project_name}/deployments/{deployment_id}/history/logs">client.pages.projects.deployments.history.logs.<a href="./src/resources/pages/projects/deployments/history/logs.ts">get</a>(projectName, deploymentId, { ...params }) -> LogGetResponse</code>

### Domains

Types:

- <code><a href="./src/resources/pages/projects/domains.ts">DomainCreateResponse</a></code>
- <code><a href="./src/resources/pages/projects/domains.ts">DomainListResponse</a></code>
- <code><a href="./src/resources/pages/projects/domains.ts">DomainDeleteResponse</a></code>
- <code><a href="./src/resources/pages/projects/domains.ts">DomainEditResponse</a></code>
- <code><a href="./src/resources/pages/projects/domains.ts">DomainGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/pages/projects/{project_name}/domains">client.pages.projects.domains.<a href="./src/resources/pages/projects/domains.ts">create</a>(projectName, { ...params }) -> DomainCreateResponse | null</code>
- <code title="get /accounts/{account_id}/pages/projects/{project_name}/domains">client.pages.projects.domains.<a href="./src/resources/pages/projects/domains.ts">list</a>(projectName, { ...params }) -> DomainListResponsesSinglePage</code>
- <code title="delete /accounts/{account_id}/pages/projects/{project_name}/domains/{domain_name}">client.pages.projects.domains.<a href="./src/resources/pages/projects/domains.ts">delete</a>(projectName, domainName, { ...params }) -> unknown</code>
- <code title="patch /accounts/{account_id}/pages/projects/{project_name}/domains/{domain_name}">client.pages.projects.domains.<a href="./src/resources/pages/projects/domains.ts">edit</a>(projectName, domainName, { ...params }) -> DomainEditResponse | null</code>
- <code title="get /accounts/{account_id}/pages/projects/{project_name}/domains/{domain_name}">client.pages.projects.domains.<a href="./src/resources/pages/projects/domains.ts">get</a>(projectName, domainName, { ...params }) -> DomainGetResponse | null</code>

# PCAPs

Types:

- <code><a href="./src/resources/pcaps/pcaps.ts">PCAP</a></code>
- <code><a href="./src/resources/pcaps/pcaps.ts">PCAPFilter</a></code>
- <code><a href="./src/resources/pcaps/pcaps.ts">PCAPCreateResponse</a></code>
- <code><a href="./src/resources/pcaps/pcaps.ts">PCAPListResponse</a></code>
- <code><a href="./src/resources/pcaps/pcaps.ts">PCAPGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/pcaps">client.pcaps.<a href="./src/resources/pcaps/pcaps.ts">create</a>({ ...params }) -> PCAPCreateResponse</code>
- <code title="get /accounts/{account_id}/pcaps">client.pcaps.<a href="./src/resources/pcaps/pcaps.ts">list</a>({ ...params }) -> PCAPListResponsesSinglePage</code>
- <code title="get /accounts/{account_id}/pcaps/{pcap_id}">client.pcaps.<a href="./src/resources/pcaps/pcaps.ts">get</a>(pcapId, { ...params }) -> PCAPGetResponse</code>

## Ownership

Types:

- <code><a href="./src/resources/pcaps/ownership.ts">Ownership</a></code>
- <code><a href="./src/resources/pcaps/ownership.ts">OwnershipGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/pcaps/ownership">client.pcaps.ownership.<a href="./src/resources/pcaps/ownership.ts">create</a>({ ...params }) -> Ownership</code>
- <code title="delete /accounts/{account_id}/pcaps/ownership/{ownership_id}">client.pcaps.ownership.<a href="./src/resources/pcaps/ownership.ts">delete</a>(ownershipId, { ...params }) -> void</code>
- <code title="get /accounts/{account_id}/pcaps/ownership">client.pcaps.ownership.<a href="./src/resources/pcaps/ownership.ts">get</a>({ ...params }) -> OwnershipGetResponse | null</code>
- <code title="post /accounts/{account_id}/pcaps/ownership/validate">client.pcaps.ownership.<a href="./src/resources/pcaps/ownership.ts">validate</a>({ ...params }) -> Ownership</code>

## Download

Methods:

- <code title="get /accounts/{account_id}/pcaps/{pcap_id}/download">client.pcaps.download.<a href="./src/resources/pcaps/download.ts">get</a>(pcapId, { ...params }) -> Response</code>

# Registrar

## Domains

Types:

- <code><a href="./src/resources/registrar/domains.ts">Domain</a></code>
- <code><a href="./src/resources/registrar/domains.ts">DomainUpdateResponse</a></code>
- <code><a href="./src/resources/registrar/domains.ts">DomainGetResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/registrar/domains/{domain_name}">client.registrar.domains.<a href="./src/resources/registrar/domains.ts">update</a>(domainName, { ...params }) -> DomainUpdateResponse | null</code>
- <code title="get /accounts/{account_id}/registrar/domains">client.registrar.domains.<a href="./src/resources/registrar/domains.ts">list</a>({ ...params }) -> DomainsSinglePage</code>
- <code title="get /accounts/{account_id}/registrar/domains/{domain_name}">client.registrar.domains.<a href="./src/resources/registrar/domains.ts">get</a>(domainName, { ...params }) -> DomainGetResponse | null</code>

# RequestTracers

## Traces

Types:

- <code><a href="./src/resources/request-tracers/traces.ts">Trace</a></code>
- <code><a href="./src/resources/request-tracers/traces.ts">TraceItem</a></code>
- <code><a href="./src/resources/request-tracers/traces.ts">TraceCreateResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/request-tracer/trace">client.requestTracers.traces.<a href="./src/resources/request-tracers/traces.ts">create</a>({ ...params }) -> TraceCreateResponse</code>

# Rules

## Lists

Types:

- <code><a href="./src/resources/rules/lists/lists.ts">Hostname</a></code>
- <code><a href="./src/resources/rules/lists/lists.ts">ListsList</a></code>
- <code><a href="./src/resources/rules/lists/lists.ts">Redirect</a></code>
- <code><a href="./src/resources/rules/lists/lists.ts">ListDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/rules/lists">client.rules.lists.<a href="./src/resources/rules/lists/lists.ts">create</a>({ ...params }) -> ListsList | null</code>
- <code title="put /accounts/{account_id}/rules/lists/{list_id}">client.rules.lists.<a href="./src/resources/rules/lists/lists.ts">update</a>(listId, { ...params }) -> ListsList | null</code>
- <code title="get /accounts/{account_id}/rules/lists">client.rules.lists.<a href="./src/resources/rules/lists/lists.ts">list</a>({ ...params }) -> ListsListsSinglePage</code>
- <code title="delete /accounts/{account_id}/rules/lists/{list_id}">client.rules.lists.<a href="./src/resources/rules/lists/lists.ts">delete</a>(listId, { ...params }) -> ListDeleteResponse | null</code>
- <code title="get /accounts/{account_id}/rules/lists/{list_id}">client.rules.lists.<a href="./src/resources/rules/lists/lists.ts">get</a>(listId, { ...params }) -> ListsList | null</code>

### BulkOperations

Types:

- <code><a href="./src/resources/rules/lists/bulk-operations.ts">OperationStatus</a></code>
- <code><a href="./src/resources/rules/lists/bulk-operations.ts">BulkOperationGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_identifier}/rules/lists/bulk_operations/{operation_id}">client.rules.lists.bulkOperations.<a href="./src/resources/rules/lists/bulk-operations.ts">get</a>(accountIdentifier, operationId) -> BulkOperationGetResponse | null</code>

### Items

Types:

- <code><a href="./src/resources/rules/lists/items.ts">ListCursor</a></code>
- <code><a href="./src/resources/rules/lists/items.ts">ListItem</a></code>
- <code><a href="./src/resources/rules/lists/items.ts">ItemCreateResponse</a></code>
- <code><a href="./src/resources/rules/lists/items.ts">ItemUpdateResponse</a></code>
- <code><a href="./src/resources/rules/lists/items.ts">ItemListResponse</a></code>
- <code><a href="./src/resources/rules/lists/items.ts">ItemDeleteResponse</a></code>
- <code><a href="./src/resources/rules/lists/items.ts">ItemGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/rules/lists/{list_id}/items">client.rules.lists.items.<a href="./src/resources/rules/lists/items.ts">create</a>(listId, [ ...body ]) -> ItemCreateResponse | null</code>
- <code title="put /accounts/{account_id}/rules/lists/{list_id}/items">client.rules.lists.items.<a href="./src/resources/rules/lists/items.ts">update</a>(listId, [ ...body ]) -> ItemUpdateResponse | null</code>
- <code title="get /accounts/{account_id}/rules/lists/{list_id}/items">client.rules.lists.items.<a href="./src/resources/rules/lists/items.ts">list</a>(listId, { ...params }) -> ItemListResponsesCursorPagination</code>
- <code title="delete /accounts/{account_id}/rules/lists/{list_id}/items">client.rules.lists.items.<a href="./src/resources/rules/lists/items.ts">delete</a>(listId, { ...params }) -> ItemDeleteResponse | null</code>
- <code title="get /accounts/{account_identifier}/rules/lists/{list_id}/items/{item_id}">client.rules.lists.items.<a href="./src/resources/rules/lists/items.ts">get</a>(accountIdentifier, listId, itemId) -> ItemGetResponse | null</code>

# Storage

## Analytics

Types:

- <code><a href="./src/resources/storage/analytics.ts">Components</a></code>
- <code><a href="./src/resources/storage/analytics.ts">Schema</a></code>

Methods:

- <code title="get /accounts/{account_id}/storage/analytics">client.storage.analytics.<a href="./src/resources/storage/analytics.ts">list</a>({ ...params }) -> Schema</code>
- <code title="get /accounts/{account_id}/storage/analytics/stored">client.storage.analytics.<a href="./src/resources/storage/analytics.ts">stored</a>({ ...params }) -> Components</code>

# Stream

Types:

- <code><a href="./src/resources/stream/stream.ts">AllowedOrigins</a></code>
- <code><a href="./src/resources/stream/stream.ts">Video</a></code>

Methods:

- <code title="post /accounts/{account_id}/stream">client.stream.<a href="./src/resources/stream/stream.ts">create</a>({ ...params }) -> void</code>
- <code title="get /accounts/{account_id}/stream">client.stream.<a href="./src/resources/stream/stream.ts">list</a>({ ...params }) -> VideosSinglePage</code>
- <code title="delete /accounts/{account_id}/stream/{identifier}">client.stream.<a href="./src/resources/stream/stream.ts">delete</a>(identifier, { ...params }) -> void</code>
- <code title="get /accounts/{account_id}/stream/{identifier}">client.stream.<a href="./src/resources/stream/stream.ts">get</a>(identifier, { ...params }) -> Video</code>

## AudioTracks

Types:

- <code><a href="./src/resources/stream/audio-tracks.ts">Audio</a></code>
- <code><a href="./src/resources/stream/audio-tracks.ts">AudioTrackDeleteResponse</a></code>
- <code><a href="./src/resources/stream/audio-tracks.ts">AudioTrackGetResponse</a></code>

Methods:

- <code title="delete /accounts/{account_id}/stream/{identifier}/audio/{audio_identifier}">client.stream.audioTracks.<a href="./src/resources/stream/audio-tracks.ts">delete</a>(identifier, audioIdentifier, { ...params }) -> AudioTrackDeleteResponse</code>
- <code title="post /accounts/{account_id}/stream/{identifier}/audio/copy">client.stream.audioTracks.<a href="./src/resources/stream/audio-tracks.ts">copy</a>(identifier, { ...params }) -> Audio</code>
- <code title="patch /accounts/{account_id}/stream/{identifier}/audio/{audio_identifier}">client.stream.audioTracks.<a href="./src/resources/stream/audio-tracks.ts">edit</a>(identifier, audioIdentifier, { ...params }) -> Audio</code>
- <code title="get /accounts/{account_id}/stream/{identifier}/audio">client.stream.audioTracks.<a href="./src/resources/stream/audio-tracks.ts">get</a>(identifier, { ...params }) -> AudioTrackGetResponse</code>

## Videos

Types:

- <code><a href="./src/resources/stream/videos.ts">VideoStorageUsageResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/stream/storage-usage">client.stream.videos.<a href="./src/resources/stream/videos.ts">storageUsage</a>({ ...params }) -> VideoStorageUsageResponse</code>

## Clip

Types:

- <code><a href="./src/resources/stream/clip.ts">Clip</a></code>

Methods:

- <code title="post /accounts/{account_id}/stream/clip">client.stream.clip.<a href="./src/resources/stream/clip.ts">create</a>({ ...params }) -> Clip</code>

## Copy

Methods:

- <code title="post /accounts/{account_id}/stream/copy">client.stream.copy.<a href="./src/resources/stream/copy.ts">create</a>({ ...params }) -> Video</code>

## DirectUpload

Types:

- <code><a href="./src/resources/stream/direct-upload.ts">DirectUploadCreateResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/stream/direct_upload">client.stream.directUpload.<a href="./src/resources/stream/direct-upload.ts">create</a>({ ...params }) -> DirectUploadCreateResponse</code>

## Keys

Types:

- <code><a href="./src/resources/stream/keys.ts">Keys</a></code>
- <code><a href="./src/resources/stream/keys.ts">KeyDeleteResponse</a></code>
- <code><a href="./src/resources/stream/keys.ts">KeyGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/stream/keys">client.stream.keys.<a href="./src/resources/stream/keys.ts">create</a>({ ...params }) -> Keys</code>
- <code title="delete /accounts/{account_id}/stream/keys/{identifier}">client.stream.keys.<a href="./src/resources/stream/keys.ts">delete</a>(identifier, { ...params }) -> KeyDeleteResponse</code>
- <code title="get /accounts/{account_id}/stream/keys">client.stream.keys.<a href="./src/resources/stream/keys.ts">get</a>({ ...params }) -> KeyGetResponse</code>

## LiveInputs

Types:

- <code><a href="./src/resources/stream/live-inputs/live-inputs.ts">LiveInput</a></code>
- <code><a href="./src/resources/stream/live-inputs/live-inputs.ts">LiveInputListResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/stream/live_inputs">client.stream.liveInputs.<a href="./src/resources/stream/live-inputs/live-inputs.ts">create</a>({ ...params }) -> LiveInput</code>
- <code title="put /accounts/{account_id}/stream/live_inputs/{live_input_identifier}">client.stream.liveInputs.<a href="./src/resources/stream/live-inputs/live-inputs.ts">update</a>(liveInputIdentifier, { ...params }) -> LiveInput</code>
- <code title="get /accounts/{account_id}/stream/live_inputs">client.stream.liveInputs.<a href="./src/resources/stream/live-inputs/live-inputs.ts">list</a>({ ...params }) -> LiveInputListResponse</code>
- <code title="delete /accounts/{account_id}/stream/live_inputs/{live_input_identifier}">client.stream.liveInputs.<a href="./src/resources/stream/live-inputs/live-inputs.ts">delete</a>(liveInputIdentifier, { ...params }) -> void</code>
- <code title="get /accounts/{account_id}/stream/live_inputs/{live_input_identifier}">client.stream.liveInputs.<a href="./src/resources/stream/live-inputs/live-inputs.ts">get</a>(liveInputIdentifier, { ...params }) -> LiveInput</code>

### Outputs

Types:

- <code><a href="./src/resources/stream/live-inputs/outputs.ts">Output</a></code>

Methods:

- <code title="post /accounts/{account_id}/stream/live_inputs/{live_input_identifier}/outputs">client.stream.liveInputs.outputs.<a href="./src/resources/stream/live-inputs/outputs.ts">create</a>(liveInputIdentifier, { ...params }) -> Output</code>
- <code title="put /accounts/{account_id}/stream/live_inputs/{live_input_identifier}/outputs/{output_identifier}">client.stream.liveInputs.outputs.<a href="./src/resources/stream/live-inputs/outputs.ts">update</a>(liveInputIdentifier, outputIdentifier, { ...params }) -> Output</code>
- <code title="get /accounts/{account_id}/stream/live_inputs/{live_input_identifier}/outputs">client.stream.liveInputs.outputs.<a href="./src/resources/stream/live-inputs/outputs.ts">list</a>(liveInputIdentifier, { ...params }) -> OutputsSinglePage</code>
- <code title="delete /accounts/{account_id}/stream/live_inputs/{live_input_identifier}/outputs/{output_identifier}">client.stream.liveInputs.outputs.<a href="./src/resources/stream/live-inputs/outputs.ts">delete</a>(liveInputIdentifier, outputIdentifier, { ...params }) -> void</code>

## Watermarks

Types:

- <code><a href="./src/resources/stream/watermarks.ts">Watermark</a></code>
- <code><a href="./src/resources/stream/watermarks.ts">WatermarkDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/stream/watermarks">client.stream.watermarks.<a href="./src/resources/stream/watermarks.ts">create</a>({ ...params }) -> Watermark</code>
- <code title="get /accounts/{account_id}/stream/watermarks">client.stream.watermarks.<a href="./src/resources/stream/watermarks.ts">list</a>({ ...params }) -> WatermarksSinglePage</code>
- <code title="delete /accounts/{account_id}/stream/watermarks/{identifier}">client.stream.watermarks.<a href="./src/resources/stream/watermarks.ts">delete</a>(identifier, { ...params }) -> WatermarkDeleteResponse</code>
- <code title="get /accounts/{account_id}/stream/watermarks/{identifier}">client.stream.watermarks.<a href="./src/resources/stream/watermarks.ts">get</a>(identifier, { ...params }) -> Watermark</code>

## Webhooks

Types:

- <code><a href="./src/resources/stream/webhooks.ts">WebhookUpdateResponse</a></code>
- <code><a href="./src/resources/stream/webhooks.ts">WebhookDeleteResponse</a></code>
- <code><a href="./src/resources/stream/webhooks.ts">WebhookGetResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/stream/webhook">client.stream.webhooks.<a href="./src/resources/stream/webhooks.ts">update</a>({ ...params }) -> WebhookUpdateResponse</code>
- <code title="delete /accounts/{account_id}/stream/webhook">client.stream.webhooks.<a href="./src/resources/stream/webhooks.ts">delete</a>({ ...params }) -> WebhookDeleteResponse</code>
- <code title="get /accounts/{account_id}/stream/webhook">client.stream.webhooks.<a href="./src/resources/stream/webhooks.ts">get</a>({ ...params }) -> WebhookGetResponse</code>

## Captions

Types:

- <code><a href="./src/resources/stream/captions/captions.ts">Caption</a></code>
- <code><a href="./src/resources/stream/captions/captions.ts">CaptionGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/stream/{identifier}/captions">client.stream.captions.<a href="./src/resources/stream/captions/captions.ts">get</a>(identifier, { ...params }) -> CaptionGetResponse</code>

### Language

Types:

- <code><a href="./src/resources/stream/captions/language/language.ts">LanguageDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/stream/{identifier}/captions/{language}/generate">client.stream.captions.language.<a href="./src/resources/stream/captions/language/language.ts">create</a>(identifier, language, { ...params }) -> Caption</code>
- <code title="put /accounts/{account_id}/stream/{identifier}/captions/{language}">client.stream.captions.language.<a href="./src/resources/stream/captions/language/language.ts">update</a>(identifier, language, { ...params }) -> Caption</code>
- <code title="delete /accounts/{account_id}/stream/{identifier}/captions/{language}">client.stream.captions.language.<a href="./src/resources/stream/captions/language/language.ts">delete</a>(identifier, language, { ...params }) -> LanguageDeleteResponse</code>
- <code title="get /accounts/{account_id}/stream/{identifier}/captions/{language}">client.stream.captions.language.<a href="./src/resources/stream/captions/language/language.ts">get</a>(identifier, language, { ...params }) -> Caption</code>

#### Vtt

Types:

- <code><a href="./src/resources/stream/captions/language/vtt.ts">VttGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/stream/{identifier}/captions/{language}/vtt">client.stream.captions.language.vtt.<a href="./src/resources/stream/captions/language/vtt.ts">get</a>(identifier, language, { ...params }) -> string</code>

## Downloads

Types:

- <code><a href="./src/resources/stream/downloads.ts">DownloadCreateResponse</a></code>
- <code><a href="./src/resources/stream/downloads.ts">DownloadDeleteResponse</a></code>
- <code><a href="./src/resources/stream/downloads.ts">DownloadGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/stream/{identifier}/downloads">client.stream.downloads.<a href="./src/resources/stream/downloads.ts">create</a>(identifier, { ...params }) -> DownloadCreateResponse</code>
- <code title="delete /accounts/{account_id}/stream/{identifier}/downloads">client.stream.downloads.<a href="./src/resources/stream/downloads.ts">delete</a>(identifier, { ...params }) -> DownloadDeleteResponse</code>
- <code title="get /accounts/{account_id}/stream/{identifier}/downloads">client.stream.downloads.<a href="./src/resources/stream/downloads.ts">get</a>(identifier, { ...params }) -> DownloadGetResponse</code>

## Embed

Types:

- <code><a href="./src/resources/stream/embed.ts">EmbedGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/stream/{identifier}/embed">client.stream.embed.<a href="./src/resources/stream/embed.ts">get</a>(identifier, { ...params }) -> string</code>

## Token

Types:

- <code><a href="./src/resources/stream/token.ts">TokenCreateResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/stream/{identifier}/token">client.stream.token.<a href="./src/resources/stream/token.ts">create</a>(identifier, { ...params }) -> TokenCreateResponse</code>

# Alerting

## AvailableAlerts

Types:

- <code><a href="./src/resources/alerting/available-alerts.ts">AvailableAlertListResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/alerting/v3/available_alerts">client.alerting.availableAlerts.<a href="./src/resources/alerting/available-alerts.ts">list</a>({ ...params }) -> AvailableAlertListResponse</code>

## Destinations

### Eligible

Types:

- <code><a href="./src/resources/alerting/destinations/eligible.ts">EligibleGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/alerting/v3/destinations/eligible">client.alerting.destinations.eligible.<a href="./src/resources/alerting/destinations/eligible.ts">get</a>({ ...params }) -> EligibleGetResponse</code>

### Pagerduty

Types:

- <code><a href="./src/resources/alerting/destinations/pagerduty.ts">Pagerduty</a></code>
- <code><a href="./src/resources/alerting/destinations/pagerduty.ts">PagerdutyCreateResponse</a></code>
- <code><a href="./src/resources/alerting/destinations/pagerduty.ts">PagerdutyDeleteResponse</a></code>
- <code><a href="./src/resources/alerting/destinations/pagerduty.ts">PagerdutyGetResponse</a></code>
- <code><a href="./src/resources/alerting/destinations/pagerduty.ts">PagerdutyLinkResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/alerting/v3/destinations/pagerduty/connect">client.alerting.destinations.pagerduty.<a href="./src/resources/alerting/destinations/pagerduty.ts">create</a>({ ...params }) -> PagerdutyCreateResponse</code>
- <code title="delete /accounts/{account_id}/alerting/v3/destinations/pagerduty">client.alerting.destinations.pagerduty.<a href="./src/resources/alerting/destinations/pagerduty.ts">delete</a>({ ...params }) -> PagerdutyDeleteResponse</code>
- <code title="get /accounts/{account_id}/alerting/v3/destinations/pagerduty">client.alerting.destinations.pagerduty.<a href="./src/resources/alerting/destinations/pagerduty.ts">get</a>({ ...params }) -> PagerdutyGetResponse</code>
- <code title="get /accounts/{account_id}/alerting/v3/destinations/pagerduty/connect/{token_id}">client.alerting.destinations.pagerduty.<a href="./src/resources/alerting/destinations/pagerduty.ts">link</a>(tokenId, { ...params }) -> PagerdutyLinkResponse</code>

### Webhooks

Types:

- <code><a href="./src/resources/alerting/destinations/webhooks.ts">Webhooks</a></code>
- <code><a href="./src/resources/alerting/destinations/webhooks.ts">WebhookCreateResponse</a></code>
- <code><a href="./src/resources/alerting/destinations/webhooks.ts">WebhookUpdateResponse</a></code>
- <code><a href="./src/resources/alerting/destinations/webhooks.ts">WebhookDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/alerting/v3/destinations/webhooks">client.alerting.destinations.webhooks.<a href="./src/resources/alerting/destinations/webhooks.ts">create</a>({ ...params }) -> WebhookCreateResponse</code>
- <code title="put /accounts/{account_id}/alerting/v3/destinations/webhooks/{webhook_id}">client.alerting.destinations.webhooks.<a href="./src/resources/alerting/destinations/webhooks.ts">update</a>(webhookId, { ...params }) -> WebhookUpdateResponse</code>
- <code title="get /accounts/{account_id}/alerting/v3/destinations/webhooks">client.alerting.destinations.webhooks.<a href="./src/resources/alerting/destinations/webhooks.ts">list</a>({ ...params }) -> WebhooksSinglePage</code>
- <code title="delete /accounts/{account_id}/alerting/v3/destinations/webhooks/{webhook_id}">client.alerting.destinations.webhooks.<a href="./src/resources/alerting/destinations/webhooks.ts">delete</a>(webhookId, { ...params }) -> WebhookDeleteResponse</code>
- <code title="get /accounts/{account_id}/alerting/v3/destinations/webhooks/{webhook_id}">client.alerting.destinations.webhooks.<a href="./src/resources/alerting/destinations/webhooks.ts">get</a>(webhookId, { ...params }) -> Webhooks</code>

## History

Types:

- <code><a href="./src/resources/alerting/history.ts">History</a></code>

Methods:

- <code title="get /accounts/{account_id}/alerting/v3/history">client.alerting.history.<a href="./src/resources/alerting/history.ts">list</a>({ ...params }) -> HistoriesV4PagePaginationArray</code>

## Policies

Types:

- <code><a href="./src/resources/alerting/policies.ts">Mechanism</a></code>
- <code><a href="./src/resources/alerting/policies.ts">Policy</a></code>
- <code><a href="./src/resources/alerting/policies.ts">PolicyFilter</a></code>
- <code><a href="./src/resources/alerting/policies.ts">PolicyCreateResponse</a></code>
- <code><a href="./src/resources/alerting/policies.ts">PolicyUpdateResponse</a></code>
- <code><a href="./src/resources/alerting/policies.ts">PolicyDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/alerting/v3/policies">client.alerting.policies.<a href="./src/resources/alerting/policies.ts">create</a>({ ...params }) -> PolicyCreateResponse</code>
- <code title="put /accounts/{account_id}/alerting/v3/policies/{policy_id}">client.alerting.policies.<a href="./src/resources/alerting/policies.ts">update</a>(policyId, { ...params }) -> PolicyUpdateResponse</code>
- <code title="get /accounts/{account_id}/alerting/v3/policies">client.alerting.policies.<a href="./src/resources/alerting/policies.ts">list</a>({ ...params }) -> PoliciesSinglePage</code>
- <code title="delete /accounts/{account_id}/alerting/v3/policies/{policy_id}">client.alerting.policies.<a href="./src/resources/alerting/policies.ts">delete</a>(policyId, { ...params }) -> PolicyDeleteResponse</code>
- <code title="get /accounts/{account_id}/alerting/v3/policies/{policy_id}">client.alerting.policies.<a href="./src/resources/alerting/policies.ts">get</a>(policyId, { ...params }) -> Policy</code>

# D1

Types:

- <code><a href="./src/resources/d1/d1.ts">D1</a></code>

## Database

Types:

- <code><a href="./src/resources/d1/database.ts">QueryResult</a></code>
- <code><a href="./src/resources/d1/database.ts">DatabaseCreateResponse</a></code>
- <code><a href="./src/resources/d1/database.ts">DatabaseListResponse</a></code>
- <code><a href="./src/resources/d1/database.ts">DatabaseDeleteResponse</a></code>
- <code><a href="./src/resources/d1/database.ts">DatabaseQueryResponse</a></code>
- <code><a href="./src/resources/d1/database.ts">DatabaseRawResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/d1/database">client.d1.database.<a href="./src/resources/d1/database.ts">create</a>({ ...params }) -> DatabaseCreateResponse</code>
- <code title="get /accounts/{account_id}/d1/database">client.d1.database.<a href="./src/resources/d1/database.ts">list</a>({ ...params }) -> DatabaseListResponsesV4PagePaginationArray</code>
- <code title="delete /accounts/{account_id}/d1/database/{database_id}">client.d1.database.<a href="./src/resources/d1/database.ts">delete</a>(databaseId, { ...params }) -> DatabaseDeleteResponse</code>
- <code title="get /accounts/{account_id}/d1/database/{database_id}">client.d1.database.<a href="./src/resources/d1/database.ts">get</a>(databaseId, { ...params }) -> D1</code>
- <code title="post /accounts/{account_id}/d1/database/{database_id}/query">client.d1.database.<a href="./src/resources/d1/database.ts">query</a>(databaseId, { ...params }) -> DatabaseQueryResponse</code>
- <code title="post /accounts/{account_id}/d1/database/{database_id}/raw">client.d1.database.<a href="./src/resources/d1/database.ts">raw</a>(databaseId, { ...params }) -> DatabaseRawResponse</code>

# R2

## Buckets

Types:

- <code><a href="./src/resources/r2/buckets.ts">Bucket</a></code>
- <code><a href="./src/resources/r2/buckets.ts">BucketDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/r2/buckets">client.r2.buckets.<a href="./src/resources/r2/buckets.ts">create</a>({ ...params }) -> Bucket</code>
- <code title="get /accounts/{account_id}/r2/buckets">client.r2.buckets.<a href="./src/resources/r2/buckets.ts">list</a>({ ...params }) -> BucketsCursorPagination</code>
- <code title="delete /accounts/{account_id}/r2/buckets/{bucket_name}">client.r2.buckets.<a href="./src/resources/r2/buckets.ts">delete</a>(bucketName, { ...params }) -> BucketDeleteResponse</code>
- <code title="get /accounts/{account_id}/r2/buckets/{bucket_name}">client.r2.buckets.<a href="./src/resources/r2/buckets.ts">get</a>(bucketName, { ...params }) -> Bucket</code>

## Sippy

Types:

- <code><a href="./src/resources/r2/sippy.ts">Provider</a></code>
- <code><a href="./src/resources/r2/sippy.ts">Sippy</a></code>
- <code><a href="./src/resources/r2/sippy.ts">SippyDeleteResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/r2/buckets/{bucket_name}/sippy">client.r2.sippy.<a href="./src/resources/r2/sippy.ts">update</a>(bucketName, { ...params }) -> Sippy</code>
- <code title="delete /accounts/{account_id}/r2/buckets/{bucket_name}/sippy">client.r2.sippy.<a href="./src/resources/r2/sippy.ts">delete</a>(bucketName, { ...params }) -> SippyDeleteResponse</code>
- <code title="get /accounts/{account_id}/r2/buckets/{bucket_name}/sippy">client.r2.sippy.<a href="./src/resources/r2/sippy.ts">get</a>(bucketName, { ...params }) -> Sippy</code>

## TemporaryCredentials

Types:

- <code><a href="./src/resources/r2/temporary-credentials.ts">TemporaryCredential</a></code>
- <code><a href="./src/resources/r2/temporary-credentials.ts">TemporaryCredentialCreateResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/r2/temp-access-credentials">client.r2.temporaryCredentials.<a href="./src/resources/r2/temporary-credentials.ts">create</a>({ ...params }) -> TemporaryCredentialCreateResponse</code>

# WARPConnector

Types:

- <code><a href="./src/resources/warp-connector.ts">WARPConnectorCreateResponse</a></code>
- <code><a href="./src/resources/warp-connector.ts">WARPConnectorListResponse</a></code>
- <code><a href="./src/resources/warp-connector.ts">WARPConnectorDeleteResponse</a></code>
- <code><a href="./src/resources/warp-connector.ts">WARPConnectorEditResponse</a></code>
- <code><a href="./src/resources/warp-connector.ts">WARPConnectorGetResponse</a></code>
- <code><a href="./src/resources/warp-connector.ts">WARPConnectorTokenResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/warp_connector">client.warpConnector.<a href="./src/resources/warp-connector.ts">create</a>({ ...params }) -> WARPConnectorCreateResponse</code>
- <code title="get /accounts/{account_id}/warp_connector">client.warpConnector.<a href="./src/resources/warp-connector.ts">list</a>({ ...params }) -> WARPConnectorListResponsesV4PagePaginationArray</code>
- <code title="delete /accounts/{account_id}/warp_connector/{tunnel_id}">client.warpConnector.<a href="./src/resources/warp-connector.ts">delete</a>(tunnelId, { ...params }) -> WARPConnectorDeleteResponse</code>
- <code title="patch /accounts/{account_id}/warp_connector/{tunnel_id}">client.warpConnector.<a href="./src/resources/warp-connector.ts">edit</a>(tunnelId, { ...params }) -> WARPConnectorEditResponse</code>
- <code title="get /accounts/{account_id}/warp_connector/{tunnel_id}">client.warpConnector.<a href="./src/resources/warp-connector.ts">get</a>(tunnelId, { ...params }) -> WARPConnectorGetResponse</code>
- <code title="get /accounts/{account_id}/warp_connector/{tunnel_id}/token">client.warpConnector.<a href="./src/resources/warp-connector.ts">token</a>(tunnelId, { ...params }) -> WARPConnectorTokenResponse</code>

# WorkersForPlatforms

## Dispatch

### Namespaces

Types:

- <code><a href="./src/resources/workers-for-platforms/dispatch/namespaces/namespaces.ts">NamespaceCreateResponse</a></code>
- <code><a href="./src/resources/workers-for-platforms/dispatch/namespaces/namespaces.ts">NamespaceListResponse</a></code>
- <code><a href="./src/resources/workers-for-platforms/dispatch/namespaces/namespaces.ts">NamespaceDeleteResponse</a></code>
- <code><a href="./src/resources/workers-for-platforms/dispatch/namespaces/namespaces.ts">NamespaceGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/workers/dispatch/namespaces">client.workersForPlatforms.dispatch.namespaces.<a href="./src/resources/workers-for-platforms/dispatch/namespaces/namespaces.ts">create</a>({ ...params }) -> NamespaceCreateResponse</code>
- <code title="get /accounts/{account_id}/workers/dispatch/namespaces">client.workersForPlatforms.dispatch.namespaces.<a href="./src/resources/workers-for-platforms/dispatch/namespaces/namespaces.ts">list</a>({ ...params }) -> NamespaceListResponsesSinglePage</code>
- <code title="delete /accounts/{account_id}/workers/dispatch/namespaces/{dispatch_namespace}">client.workersForPlatforms.dispatch.namespaces.<a href="./src/resources/workers-for-platforms/dispatch/namespaces/namespaces.ts">delete</a>(dispatchNamespace, { ...params }) -> NamespaceDeleteResponse | null</code>
- <code title="get /accounts/{account_id}/workers/dispatch/namespaces/{dispatch_namespace}">client.workersForPlatforms.dispatch.namespaces.<a href="./src/resources/workers-for-platforms/dispatch/namespaces/namespaces.ts">get</a>(dispatchNamespace, { ...params }) -> NamespaceGetResponse</code>

#### Scripts

Types:

- <code><a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/scripts.ts">Script</a></code>

Methods:

- <code title="put /accounts/{account_id}/workers/dispatch/namespaces/{dispatch_namespace}/scripts/{script_name}">client.workersForPlatforms.dispatch.namespaces.scripts.<a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/scripts.ts">update</a>(dispatchNamespace, scriptName, { ...params }) -> Script</code>
- <code title="delete /accounts/{account_id}/workers/dispatch/namespaces/{dispatch_namespace}/scripts/{script_name}">client.workersForPlatforms.dispatch.namespaces.scripts.<a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/scripts.ts">delete</a>(dispatchNamespace, scriptName, { ...params }) -> void</code>
- <code title="get /accounts/{account_id}/workers/dispatch/namespaces/{dispatch_namespace}/scripts/{script_name}">client.workersForPlatforms.dispatch.namespaces.scripts.<a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/scripts.ts">get</a>(dispatchNamespace, scriptName, { ...params }) -> Script</code>

##### Content

Methods:

- <code title="put /accounts/{account_id}/workers/dispatch/namespaces/{dispatch_namespace}/scripts/{script_name}/content">client.workersForPlatforms.dispatch.namespaces.scripts.content.<a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/content.ts">update</a>(dispatchNamespace, scriptName, { ...params }) -> Script</code>
- <code title="get /accounts/{account_id}/workers/dispatch/namespaces/{dispatch_namespace}/scripts/{script_name}/content">client.workersForPlatforms.dispatch.namespaces.scripts.content.<a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/content.ts">get</a>(dispatchNamespace, scriptName, { ...params }) -> Response</code>

##### Settings

Types:

- <code><a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/settings.ts">SettingEditResponse</a></code>
- <code><a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/settings.ts">SettingGetResponse</a></code>

Methods:

- <code title="patch /accounts/{account_id}/workers/dispatch/namespaces/{dispatch_namespace}/scripts/{script_name}/settings">client.workersForPlatforms.dispatch.namespaces.scripts.settings.<a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/settings.ts">edit</a>(dispatchNamespace, scriptName, { ...params }) -> SettingEditResponse</code>
- <code title="get /accounts/{account_id}/workers/dispatch/namespaces/{dispatch_namespace}/scripts/{script_name}/settings">client.workersForPlatforms.dispatch.namespaces.scripts.settings.<a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/settings.ts">get</a>(dispatchNamespace, scriptName, { ...params }) -> SettingGetResponse</code>

##### Bindings

Types:

- <code><a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/bindings.ts">BindingGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/workers/dispatch/namespaces/{dispatch_namespace}/scripts/{script_name}/bindings">client.workersForPlatforms.dispatch.namespaces.scripts.bindings.<a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/bindings.ts">get</a>(dispatchNamespace, scriptName, { ...params }) -> BindingGetResponse</code>

##### Secrets

Types:

- <code><a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/secrets.ts">SecretUpdateResponse</a></code>
- <code><a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/secrets.ts">SecretListResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/workers/dispatch/namespaces/{dispatch_namespace}/scripts/{script_name}/secrets">client.workersForPlatforms.dispatch.namespaces.scripts.secrets.<a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/secrets.ts">update</a>(dispatchNamespace, scriptName, { ...params }) -> SecretUpdateResponse</code>
- <code title="get /accounts/{account_id}/workers/dispatch/namespaces/{dispatch_namespace}/scripts/{script_name}/secrets">client.workersForPlatforms.dispatch.namespaces.scripts.secrets.<a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/secrets.ts">list</a>(dispatchNamespace, scriptName, { ...params }) -> SecretListResponsesSinglePage</code>

##### Tags

Types:

- <code><a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/tags.ts">TagUpdateResponse</a></code>
- <code><a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/tags.ts">TagListResponse</a></code>
- <code><a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/tags.ts">TagDeleteResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/workers/dispatch/namespaces/{dispatch_namespace}/scripts/{script_name}/tags">client.workersForPlatforms.dispatch.namespaces.scripts.tags.<a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/tags.ts">update</a>(dispatchNamespace, scriptName, [ ...body ]) -> TagUpdateResponse</code>
- <code title="get /accounts/{account_id}/workers/dispatch/namespaces/{dispatch_namespace}/scripts/{script_name}/tags">client.workersForPlatforms.dispatch.namespaces.scripts.tags.<a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/tags.ts">list</a>(dispatchNamespace, scriptName, { ...params }) -> TagListResponsesSinglePage</code>
- <code title="delete /accounts/{account_id}/workers/dispatch/namespaces/{dispatch_namespace}/scripts/{script_name}/tags/{tag}">client.workersForPlatforms.dispatch.namespaces.scripts.tags.<a href="./src/resources/workers-for-platforms/dispatch/namespaces/scripts/tags.ts">delete</a>(dispatchNamespace, scriptName, tag, { ...params }) -> TagDeleteResponse | null</code>

# ZeroTrust

## Devices

Types:

- <code><a href="./src/resources/zero-trust/devices/devices.ts">Device</a></code>
- <code><a href="./src/resources/zero-trust/devices/devices.ts">DeviceGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/devices">client.zeroTrust.devices.<a href="./src/resources/zero-trust/devices/devices.ts">list</a>({ ...params }) -> DevicesSinglePage</code>
- <code title="get /accounts/{account_id}/devices/{device_id}">client.zeroTrust.devices.<a href="./src/resources/zero-trust/devices/devices.ts">get</a>(deviceId, { ...params }) -> DeviceGetResponse</code>

### DEXTests

Types:

- <code><a href="./src/resources/zero-trust/devices/dex-tests.ts">DEXTest</a></code>
- <code><a href="./src/resources/zero-trust/devices/dex-tests.ts">SchemaData</a></code>
- <code><a href="./src/resources/zero-trust/devices/dex-tests.ts">SchemaHTTP</a></code>
- <code><a href="./src/resources/zero-trust/devices/dex-tests.ts">DEXTestDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/devices/dex_tests">client.zeroTrust.devices.dexTests.<a href="./src/resources/zero-trust/devices/dex-tests.ts">create</a>({ ...params }) -> SchemaHTTP | null</code>
- <code title="put /accounts/{account_id}/devices/dex_tests/{dex_test_id}">client.zeroTrust.devices.dexTests.<a href="./src/resources/zero-trust/devices/dex-tests.ts">update</a>(dexTestId, { ...params }) -> SchemaHTTP | null</code>
- <code title="get /accounts/{account_id}/devices/dex_tests">client.zeroTrust.devices.dexTests.<a href="./src/resources/zero-trust/devices/dex-tests.ts">list</a>({ ...params }) -> SchemaHTTPSSinglePage</code>
- <code title="delete /accounts/{account_id}/devices/dex_tests/{dex_test_id}">client.zeroTrust.devices.dexTests.<a href="./src/resources/zero-trust/devices/dex-tests.ts">delete</a>(dexTestId, { ...params }) -> DEXTestDeleteResponse | null</code>
- <code title="get /accounts/{account_id}/devices/dex_tests/{dex_test_id}">client.zeroTrust.devices.dexTests.<a href="./src/resources/zero-trust/devices/dex-tests.ts">get</a>(dexTestId, { ...params }) -> SchemaHTTP | null</code>

### Networks

Types:

- <code><a href="./src/resources/zero-trust/devices/networks.ts">DeviceNetwork</a></code>
- <code><a href="./src/resources/zero-trust/devices/networks.ts">NetworkDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/devices/networks">client.zeroTrust.devices.networks.<a href="./src/resources/zero-trust/devices/networks.ts">create</a>({ ...params }) -> DeviceNetwork | null</code>
- <code title="put /accounts/{account_id}/devices/networks/{network_id}">client.zeroTrust.devices.networks.<a href="./src/resources/zero-trust/devices/networks.ts">update</a>(networkId, { ...params }) -> DeviceNetwork | null</code>
- <code title="get /accounts/{account_id}/devices/networks">client.zeroTrust.devices.networks.<a href="./src/resources/zero-trust/devices/networks.ts">list</a>({ ...params }) -> DeviceNetworksSinglePage</code>
- <code title="delete /accounts/{account_id}/devices/networks/{network_id}">client.zeroTrust.devices.networks.<a href="./src/resources/zero-trust/devices/networks.ts">delete</a>(networkId, { ...params }) -> NetworkDeleteResponse | null</code>
- <code title="get /accounts/{account_id}/devices/networks/{network_id}">client.zeroTrust.devices.networks.<a href="./src/resources/zero-trust/devices/networks.ts">get</a>(networkId, { ...params }) -> DeviceNetwork | null</code>

### Policies

Types:

- <code><a href="./src/resources/zero-trust/devices/policies/policies.ts">SettingsPolicy</a></code>
- <code><a href="./src/resources/zero-trust/devices/policies/policies.ts">PolicyDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/devices/policy">client.zeroTrust.devices.policies.<a href="./src/resources/zero-trust/devices/policies/policies.ts">create</a>({ ...params }) -> SettingsPolicy | null</code>
- <code title="get /accounts/{account_id}/devices/policies">client.zeroTrust.devices.policies.<a href="./src/resources/zero-trust/devices/policies/policies.ts">list</a>({ ...params }) -> SettingsPoliciesSinglePage</code>
- <code title="delete /accounts/{account_id}/devices/policy/{policy_id}">client.zeroTrust.devices.policies.<a href="./src/resources/zero-trust/devices/policies/policies.ts">delete</a>(policyId, { ...params }) -> PolicyDeleteResponse | null</code>
- <code title="patch /accounts/{account_id}/devices/policy/{policy_id}">client.zeroTrust.devices.policies.<a href="./src/resources/zero-trust/devices/policies/policies.ts">edit</a>(policyId, { ...params }) -> SettingsPolicy | null</code>
- <code title="get /accounts/{account_id}/devices/policy/{policy_id}">client.zeroTrust.devices.policies.<a href="./src/resources/zero-trust/devices/policies/policies.ts">get</a>(policyId, { ...params }) -> SettingsPolicy | null</code>

#### DefaultPolicy

Types:

- <code><a href="./src/resources/zero-trust/devices/policies/default-policy.ts">DefaultPolicyGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/devices/policy">client.zeroTrust.devices.policies.defaultPolicy.<a href="./src/resources/zero-trust/devices/policies/default-policy.ts">get</a>({ ...params }) -> DefaultPolicyGetResponse | null</code>

#### Excludes

Types:

- <code><a href="./src/resources/zero-trust/devices/policies/excludes.ts">SplitTunnelExclude</a></code>
- <code><a href="./src/resources/zero-trust/devices/policies/excludes.ts">ExcludeUpdateResponse</a></code>
- <code><a href="./src/resources/zero-trust/devices/policies/excludes.ts">ExcludeGetResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/devices/policy/exclude">client.zeroTrust.devices.policies.excludes.<a href="./src/resources/zero-trust/devices/policies/excludes.ts">update</a>([ ...body ]) -> ExcludeUpdateResponse | null</code>
- <code title="get /accounts/{account_id}/devices/policy/exclude">client.zeroTrust.devices.policies.excludes.<a href="./src/resources/zero-trust/devices/policies/excludes.ts">list</a>({ ...params }) -> SplitTunnelExcludesSinglePage</code>
- <code title="get /accounts/{account_id}/devices/policy/{policy_id}/exclude">client.zeroTrust.devices.policies.excludes.<a href="./src/resources/zero-trust/devices/policies/excludes.ts">get</a>(policyId, { ...params }) -> ExcludeGetResponse | null</code>

#### FallbackDomains

Types:

- <code><a href="./src/resources/zero-trust/devices/policies/fallback-domains.ts">FallbackDomain</a></code>
- <code><a href="./src/resources/zero-trust/devices/policies/fallback-domains.ts">FallbackDomainPolicy</a></code>
- <code><a href="./src/resources/zero-trust/devices/policies/fallback-domains.ts">FallbackDomainUpdateResponse</a></code>
- <code><a href="./src/resources/zero-trust/devices/policies/fallback-domains.ts">FallbackDomainGetResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/devices/policy/{policy_id}/fallback_domains">client.zeroTrust.devices.policies.fallbackDomains.<a href="./src/resources/zero-trust/devices/policies/fallback-domains.ts">update</a>(policyId, [ ...body ]) -> FallbackDomainUpdateResponse | null</code>
- <code title="get /accounts/{account_id}/devices/policy/fallback_domains">client.zeroTrust.devices.policies.fallbackDomains.<a href="./src/resources/zero-trust/devices/policies/fallback-domains.ts">list</a>({ ...params }) -> FallbackDomainsSinglePage</code>
- <code title="get /accounts/{account_id}/devices/policy/{policy_id}/fallback_domains">client.zeroTrust.devices.policies.fallbackDomains.<a href="./src/resources/zero-trust/devices/policies/fallback-domains.ts">get</a>(policyId, { ...params }) -> FallbackDomainGetResponse | null</code>

#### Includes

Types:

- <code><a href="./src/resources/zero-trust/devices/policies/includes.ts">SplitTunnelInclude</a></code>
- <code><a href="./src/resources/zero-trust/devices/policies/includes.ts">IncludeUpdateResponse</a></code>
- <code><a href="./src/resources/zero-trust/devices/policies/includes.ts">IncludeGetResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/devices/policy/include">client.zeroTrust.devices.policies.includes.<a href="./src/resources/zero-trust/devices/policies/includes.ts">update</a>([ ...body ]) -> IncludeUpdateResponse | null</code>
- <code title="get /accounts/{account_id}/devices/policy/include">client.zeroTrust.devices.policies.includes.<a href="./src/resources/zero-trust/devices/policies/includes.ts">list</a>({ ...params }) -> SplitTunnelIncludesSinglePage</code>
- <code title="get /accounts/{account_id}/devices/policy/{policy_id}/include">client.zeroTrust.devices.policies.includes.<a href="./src/resources/zero-trust/devices/policies/includes.ts">get</a>(policyId, { ...params }) -> IncludeGetResponse | null</code>

### Posture

Types:

- <code><a href="./src/resources/zero-trust/devices/posture/posture.ts">CarbonblackInput</a></code>
- <code><a href="./src/resources/zero-trust/devices/posture/posture.ts">ClientCertificateInput</a></code>
- <code><a href="./src/resources/zero-trust/devices/posture/posture.ts">CrowdstrikeInput</a></code>
- <code><a href="./src/resources/zero-trust/devices/posture/posture.ts">DeviceInput</a></code>
- <code><a href="./src/resources/zero-trust/devices/posture/posture.ts">DeviceMatch</a></code>
- <code><a href="./src/resources/zero-trust/devices/posture/posture.ts">DevicePostureRule</a></code>
- <code><a href="./src/resources/zero-trust/devices/posture/posture.ts">DiskEncryptionInput</a></code>
- <code><a href="./src/resources/zero-trust/devices/posture/posture.ts">DomainJoinedInput</a></code>
- <code><a href="./src/resources/zero-trust/devices/posture/posture.ts">FileInput</a></code>
- <code><a href="./src/resources/zero-trust/devices/posture/posture.ts">FirewallInput</a></code>
- <code><a href="./src/resources/zero-trust/devices/posture/posture.ts">IntuneInput</a></code>
- <code><a href="./src/resources/zero-trust/devices/posture/posture.ts">KolideInput</a></code>
- <code><a href="./src/resources/zero-trust/devices/posture/posture.ts">OSVersionInput</a></code>
- <code><a href="./src/resources/zero-trust/devices/posture/posture.ts">SentineloneInput</a></code>
- <code><a href="./src/resources/zero-trust/devices/posture/posture.ts">SentineloneS2sInput</a></code>
- <code><a href="./src/resources/zero-trust/devices/posture/posture.ts">TaniumInput</a></code>
- <code><a href="./src/resources/zero-trust/devices/posture/posture.ts">UniqueClientIDInput</a></code>
- <code><a href="./src/resources/zero-trust/devices/posture/posture.ts">WorkspaceOneInput</a></code>
- <code><a href="./src/resources/zero-trust/devices/posture/posture.ts">PostureDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/devices/posture">client.zeroTrust.devices.posture.<a href="./src/resources/zero-trust/devices/posture/posture.ts">create</a>({ ...params }) -> DevicePostureRule | null</code>
- <code title="put /accounts/{account_id}/devices/posture/{rule_id}">client.zeroTrust.devices.posture.<a href="./src/resources/zero-trust/devices/posture/posture.ts">update</a>(ruleId, { ...params }) -> DevicePostureRule | null</code>
- <code title="get /accounts/{account_id}/devices/posture">client.zeroTrust.devices.posture.<a href="./src/resources/zero-trust/devices/posture/posture.ts">list</a>({ ...params }) -> DevicePostureRulesSinglePage</code>
- <code title="delete /accounts/{account_id}/devices/posture/{rule_id}">client.zeroTrust.devices.posture.<a href="./src/resources/zero-trust/devices/posture/posture.ts">delete</a>(ruleId, { ...params }) -> PostureDeleteResponse | null</code>
- <code title="get /accounts/{account_id}/devices/posture/{rule_id}">client.zeroTrust.devices.posture.<a href="./src/resources/zero-trust/devices/posture/posture.ts">get</a>(ruleId, { ...params }) -> DevicePostureRule | null</code>

#### Integrations

Types:

- <code><a href="./src/resources/zero-trust/devices/posture/integrations.ts">Integration</a></code>
- <code><a href="./src/resources/zero-trust/devices/posture/integrations.ts">IntegrationDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/devices/posture/integration">client.zeroTrust.devices.posture.integrations.<a href="./src/resources/zero-trust/devices/posture/integrations.ts">create</a>({ ...params }) -> Integration | null</code>
- <code title="get /accounts/{account_id}/devices/posture/integration">client.zeroTrust.devices.posture.integrations.<a href="./src/resources/zero-trust/devices/posture/integrations.ts">list</a>({ ...params }) -> IntegrationsSinglePage</code>
- <code title="delete /accounts/{account_id}/devices/posture/integration/{integration_id}">client.zeroTrust.devices.posture.integrations.<a href="./src/resources/zero-trust/devices/posture/integrations.ts">delete</a>(integrationId, { ...params }) -> IntegrationDeleteResponse</code>
- <code title="patch /accounts/{account_id}/devices/posture/integration/{integration_id}">client.zeroTrust.devices.posture.integrations.<a href="./src/resources/zero-trust/devices/posture/integrations.ts">edit</a>(integrationId, { ...params }) -> Integration | null</code>
- <code title="get /accounts/{account_id}/devices/posture/integration/{integration_id}">client.zeroTrust.devices.posture.integrations.<a href="./src/resources/zero-trust/devices/posture/integrations.ts">get</a>(integrationId, { ...params }) -> Integration | null</code>

### Revoke

Types:

- <code><a href="./src/resources/zero-trust/devices/revoke.ts">RevokeCreateResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/devices/revoke">client.zeroTrust.devices.revoke.<a href="./src/resources/zero-trust/devices/revoke.ts">create</a>([ ...body ]) -> RevokeCreateResponse</code>

### Settings

Types:

- <code><a href="./src/resources/zero-trust/devices/settings.ts">DeviceSettings</a></code>

Methods:

- <code title="put /accounts/{account_id}/devices/settings">client.zeroTrust.devices.settings.<a href="./src/resources/zero-trust/devices/settings.ts">update</a>({ ...params }) -> DeviceSettings | null</code>
- <code title="get /accounts/{account_id}/devices/settings">client.zeroTrust.devices.settings.<a href="./src/resources/zero-trust/devices/settings.ts">list</a>({ ...params }) -> DeviceSettings | null</code>

### Unrevoke

Types:

- <code><a href="./src/resources/zero-trust/devices/unrevoke.ts">UnrevokeCreateResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/devices/unrevoke">client.zeroTrust.devices.unrevoke.<a href="./src/resources/zero-trust/devices/unrevoke.ts">create</a>([ ...body ]) -> UnrevokeCreateResponse</code>

### OverrideCodes

Types:

- <code><a href="./src/resources/zero-trust/devices/override-codes.ts">OverrideCodeListResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/devices/{device_id}/override_codes">client.zeroTrust.devices.overrideCodes.<a href="./src/resources/zero-trust/devices/override-codes.ts">list</a>(deviceId, { ...params }) -> OverrideCodeListResponse | null</code>

## IdentityProviders

Types:

- <code><a href="./src/resources/zero-trust/identity-providers.ts">AzureAD</a></code>
- <code><a href="./src/resources/zero-trust/identity-providers.ts">GenericOAuthConfig</a></code>
- <code><a href="./src/resources/zero-trust/identity-providers.ts">IdentityProvider</a></code>
- <code><a href="./src/resources/zero-trust/identity-providers.ts">IdentityProviderType</a></code>
- <code><a href="./src/resources/zero-trust/identity-providers.ts">SCIMConfig</a></code>
- <code><a href="./src/resources/zero-trust/identity-providers.ts">IdentityProviderListResponse</a></code>
- <code><a href="./src/resources/zero-trust/identity-providers.ts">IdentityProviderDeleteResponse</a></code>

Methods:

- <code title="post /{account_or_zone}/{account_or_zone_id}/access/identity_providers">client.zeroTrust.identityProviders.<a href="./src/resources/zero-trust/identity-providers.ts">create</a>({ ...params }) -> IdentityProvider</code>
- <code title="put /{account_or_zone}/{account_or_zone_id}/access/identity_providers/{identity_provider_id}">client.zeroTrust.identityProviders.<a href="./src/resources/zero-trust/identity-providers.ts">update</a>(identityProviderId, { ...params }) -> IdentityProvider</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/access/identity_providers">client.zeroTrust.identityProviders.<a href="./src/resources/zero-trust/identity-providers.ts">list</a>({ ...params }) -> IdentityProviderListResponsesSinglePage</code>
- <code title="delete /{account_or_zone}/{account_or_zone_id}/access/identity_providers/{identity_provider_id}">client.zeroTrust.identityProviders.<a href="./src/resources/zero-trust/identity-providers.ts">delete</a>(identityProviderId, { ...params }) -> IdentityProviderDeleteResponse</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/access/identity_providers/{identity_provider_id}">client.zeroTrust.identityProviders.<a href="./src/resources/zero-trust/identity-providers.ts">get</a>(identityProviderId, { ...params }) -> IdentityProvider</code>

## Organizations

Types:

- <code><a href="./src/resources/zero-trust/organizations.ts">LoginDesign</a></code>
- <code><a href="./src/resources/zero-trust/organizations.ts">Organization</a></code>
- <code><a href="./src/resources/zero-trust/organizations.ts">OrganizationRevokeUsersResponse</a></code>

Methods:

- <code title="post /{account_or_zone}/{account_or_zone_id}/access/organizations">client.zeroTrust.organizations.<a href="./src/resources/zero-trust/organizations.ts">create</a>({ ...params }) -> Organization</code>
- <code title="put /{account_or_zone}/{account_or_zone_id}/access/organizations">client.zeroTrust.organizations.<a href="./src/resources/zero-trust/organizations.ts">update</a>({ ...params }) -> Organization</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/access/organizations">client.zeroTrust.organizations.<a href="./src/resources/zero-trust/organizations.ts">list</a>({ ...params }) -> Organization</code>
- <code title="post /{account_or_zone}/{account_or_zone_id}/access/organizations/revoke_user">client.zeroTrust.organizations.<a href="./src/resources/zero-trust/organizations.ts">revokeUsers</a>({ ...params }) -> OrganizationRevokeUsersResponse</code>

## Seats

Types:

- <code><a href="./src/resources/zero-trust/seats.ts">Seat</a></code>
- <code><a href="./src/resources/zero-trust/seats.ts">SeatEditResponse</a></code>

Methods:

- <code title="patch /accounts/{account_id}/access/seats">client.zeroTrust.seats.<a href="./src/resources/zero-trust/seats.ts">edit</a>([ ...body ]) -> SeatEditResponse | null</code>

## Access

Types:

- <code><a href="./src/resources/zero-trust/access/access.ts">AccessDevicePostureRule</a></code>
- <code><a href="./src/resources/zero-trust/access/access.ts">AccessRule</a></code>
- <code><a href="./src/resources/zero-trust/access/access.ts">AnyValidServiceTokenRule</a></code>
- <code><a href="./src/resources/zero-trust/access/access.ts">AuthenticationMethodRule</a></code>
- <code><a href="./src/resources/zero-trust/access/access.ts">AzureGroupRule</a></code>
- <code><a href="./src/resources/zero-trust/access/access.ts">CertificateRule</a></code>
- <code><a href="./src/resources/zero-trust/access/access.ts">CountryRule</a></code>
- <code><a href="./src/resources/zero-trust/access/access.ts">DomainRule</a></code>
- <code><a href="./src/resources/zero-trust/access/access.ts">EmailListRule</a></code>
- <code><a href="./src/resources/zero-trust/access/access.ts">EmailRule</a></code>
- <code><a href="./src/resources/zero-trust/access/access.ts">EveryoneRule</a></code>
- <code><a href="./src/resources/zero-trust/access/access.ts">ExternalEvaluationRule</a></code>
- <code><a href="./src/resources/zero-trust/access/access.ts">GitHubOrganizationRule</a></code>
- <code><a href="./src/resources/zero-trust/access/access.ts">GroupRule</a></code>
- <code><a href="./src/resources/zero-trust/access/access.ts">GSuiteGroupRule</a></code>
- <code><a href="./src/resources/zero-trust/access/access.ts">IPListRule</a></code>
- <code><a href="./src/resources/zero-trust/access/access.ts">IPRule</a></code>
- <code><a href="./src/resources/zero-trust/access/access.ts">OktaGroupRule</a></code>
- <code><a href="./src/resources/zero-trust/access/access.ts">SAMLGroupRule</a></code>
- <code><a href="./src/resources/zero-trust/access/access.ts">ServiceTokenRule</a></code>

### Applications

Types:

- <code><a href="./src/resources/zero-trust/access/applications/applications.ts">AllowedHeaders</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/applications.ts">AllowedIdPs</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/applications.ts">AllowedMethods</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/applications.ts">AllowedOrigins</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/applications.ts">AppID</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/applications.ts">Application</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/applications.ts">ApplicationType</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/applications.ts">CORSHeaders</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/applications.ts">Decision</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/applications.ts">SaaSAppNameFormat</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/applications.ts">SaaSAppNameIDFormat</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/applications.ts">SaaSAppSource</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/applications.ts">SAMLSaaSApp</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/applications.ts">SelfHostedDomains</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/applications.ts">ApplicationCreateResponse</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/applications.ts">ApplicationUpdateResponse</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/applications.ts">ApplicationListResponse</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/applications.ts">ApplicationDeleteResponse</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/applications.ts">ApplicationGetResponse</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/applications.ts">ApplicationRevokeTokensResponse</a></code>

Methods:

- <code title="post /{account_or_zone}/{account_or_zone_id}/access/apps">client.zeroTrust.access.applications.<a href="./src/resources/zero-trust/access/applications/applications.ts">create</a>({ ...params }) -> ApplicationCreateResponse</code>
- <code title="put /{account_or_zone}/{account_or_zone_id}/access/apps/{app_id}">client.zeroTrust.access.applications.<a href="./src/resources/zero-trust/access/applications/applications.ts">update</a>(appId, { ...params }) -> ApplicationUpdateResponse</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/access/apps">client.zeroTrust.access.applications.<a href="./src/resources/zero-trust/access/applications/applications.ts">list</a>({ ...params }) -> ApplicationListResponsesSinglePage</code>
- <code title="delete /{account_or_zone}/{account_or_zone_id}/access/apps/{app_id}">client.zeroTrust.access.applications.<a href="./src/resources/zero-trust/access/applications/applications.ts">delete</a>(appId, { ...params }) -> ApplicationDeleteResponse</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/access/apps/{app_id}">client.zeroTrust.access.applications.<a href="./src/resources/zero-trust/access/applications/applications.ts">get</a>(appId, { ...params }) -> ApplicationGetResponse</code>
- <code title="post /{account_or_zone}/{account_or_zone_id}/access/apps/{app_id}/revoke_tokens">client.zeroTrust.access.applications.<a href="./src/resources/zero-trust/access/applications/applications.ts">revokeTokens</a>(appId, { ...params }) -> ApplicationRevokeTokensResponse | null</code>

#### CAs

Types:

- <code><a href="./src/resources/zero-trust/access/applications/cas.ts">CA</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/cas.ts">CACreateResponse</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/cas.ts">CADeleteResponse</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/cas.ts">CAGetResponse</a></code>

Methods:

- <code title="post /{account_or_zone}/{account_or_zone_id}/access/apps/{app_id}/ca">client.zeroTrust.access.applications.cas.<a href="./src/resources/zero-trust/access/applications/cas.ts">create</a>(appId, { ...params }) -> CACreateResponse</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/access/apps/ca">client.zeroTrust.access.applications.cas.<a href="./src/resources/zero-trust/access/applications/cas.ts">list</a>({ ...params }) -> CAsSinglePage</code>
- <code title="delete /{account_or_zone}/{account_or_zone_id}/access/apps/{app_id}/ca">client.zeroTrust.access.applications.cas.<a href="./src/resources/zero-trust/access/applications/cas.ts">delete</a>(appId, { ...params }) -> CADeleteResponse</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/access/apps/{app_id}/ca">client.zeroTrust.access.applications.cas.<a href="./src/resources/zero-trust/access/applications/cas.ts">get</a>(appId, { ...params }) -> CAGetResponse</code>

#### UserPolicyChecks

Types:

- <code><a href="./src/resources/zero-trust/access/applications/user-policy-checks.ts">UserPolicyCheckGeo</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/user-policy-checks.ts">UserPolicyCheckListResponse</a></code>

Methods:

- <code title="get /{account_or_zone}/{account_or_zone_id}/access/apps/{app_id}/user_policy_checks">client.zeroTrust.access.applications.userPolicyChecks.<a href="./src/resources/zero-trust/access/applications/user-policy-checks.ts">list</a>(appId, { ...params }) -> UserPolicyCheckListResponse</code>

#### Policies

Types:

- <code><a href="./src/resources/zero-trust/access/applications/policies.ts">ApprovalGroup</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/policies.ts">Policy</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/policies.ts">PolicyCreateResponse</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/policies.ts">PolicyUpdateResponse</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/policies.ts">PolicyListResponse</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/policies.ts">PolicyDeleteResponse</a></code>
- <code><a href="./src/resources/zero-trust/access/applications/policies.ts">PolicyGetResponse</a></code>

Methods:

- <code title="post /{account_or_zone}/{account_or_zone_id}/access/apps/{app_id}/policies">client.zeroTrust.access.applications.policies.<a href="./src/resources/zero-trust/access/applications/policies.ts">create</a>(appId, { ...params }) -> PolicyCreateResponse</code>
- <code title="put /{account_or_zone}/{account_or_zone_id}/access/apps/{app_id}/policies/{policy_id}">client.zeroTrust.access.applications.policies.<a href="./src/resources/zero-trust/access/applications/policies.ts">update</a>(appId, policyId, { ...params }) -> PolicyUpdateResponse</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/access/apps/{app_id}/policies">client.zeroTrust.access.applications.policies.<a href="./src/resources/zero-trust/access/applications/policies.ts">list</a>(appId, { ...params }) -> PolicyListResponsesSinglePage</code>
- <code title="delete /{account_or_zone}/{account_or_zone_id}/access/apps/{app_id}/policies/{policy_id}">client.zeroTrust.access.applications.policies.<a href="./src/resources/zero-trust/access/applications/policies.ts">delete</a>(appId, policyId, { ...params }) -> PolicyDeleteResponse</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/access/apps/{app_id}/policies/{policy_id}">client.zeroTrust.access.applications.policies.<a href="./src/resources/zero-trust/access/applications/policies.ts">get</a>(appId, policyId, { ...params }) -> PolicyGetResponse</code>

### Certificates

Types:

- <code><a href="./src/resources/zero-trust/access/certificates/certificates.ts">AssociatedHostnames</a></code>
- <code><a href="./src/resources/zero-trust/access/certificates/certificates.ts">Certificate</a></code>
- <code><a href="./src/resources/zero-trust/access/certificates/certificates.ts">CertificateDeleteResponse</a></code>

Methods:

- <code title="post /{account_or_zone}/{account_or_zone_id}/access/certificates">client.zeroTrust.access.certificates.<a href="./src/resources/zero-trust/access/certificates/certificates.ts">create</a>({ ...params }) -> Certificate</code>
- <code title="put /{account_or_zone}/{account_or_zone_id}/access/certificates/{certificate_id}">client.zeroTrust.access.certificates.<a href="./src/resources/zero-trust/access/certificates/certificates.ts">update</a>(certificateId, { ...params }) -> Certificate</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/access/certificates">client.zeroTrust.access.certificates.<a href="./src/resources/zero-trust/access/certificates/certificates.ts">list</a>({ ...params }) -> CertificatesSinglePage</code>
- <code title="delete /{account_or_zone}/{account_or_zone_id}/access/certificates/{certificate_id}">client.zeroTrust.access.certificates.<a href="./src/resources/zero-trust/access/certificates/certificates.ts">delete</a>(certificateId, { ...params }) -> CertificateDeleteResponse</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/access/certificates/{certificate_id}">client.zeroTrust.access.certificates.<a href="./src/resources/zero-trust/access/certificates/certificates.ts">get</a>(certificateId, { ...params }) -> Certificate</code>

#### Settings

Types:

- <code><a href="./src/resources/zero-trust/access/certificates/settings.ts">CertificateSettings</a></code>
- <code><a href="./src/resources/zero-trust/access/certificates/settings.ts">SettingUpdateResponse</a></code>
- <code><a href="./src/resources/zero-trust/access/certificates/settings.ts">SettingGetResponse</a></code>

Methods:

- <code title="put /{account_or_zone}/{account_or_zone_id}/access/certificates/settings">client.zeroTrust.access.certificates.settings.<a href="./src/resources/zero-trust/access/certificates/settings.ts">update</a>({ ...params }) -> SettingUpdateResponse | null</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/access/certificates/settings">client.zeroTrust.access.certificates.settings.<a href="./src/resources/zero-trust/access/certificates/settings.ts">get</a>({ ...params }) -> SettingGetResponse | null</code>

### Groups

Types:

- <code><a href="./src/resources/zero-trust/access/groups.ts">ZeroTrustGroup</a></code>
- <code><a href="./src/resources/zero-trust/access/groups.ts">GroupDeleteResponse</a></code>

Methods:

- <code title="post /{account_or_zone}/{account_or_zone_id}/access/groups">client.zeroTrust.access.groups.<a href="./src/resources/zero-trust/access/groups.ts">create</a>({ ...params }) -> ZeroTrustGroup</code>
- <code title="put /{account_or_zone}/{account_or_zone_id}/access/groups/{group_id}">client.zeroTrust.access.groups.<a href="./src/resources/zero-trust/access/groups.ts">update</a>(groupId, { ...params }) -> ZeroTrustGroup</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/access/groups">client.zeroTrust.access.groups.<a href="./src/resources/zero-trust/access/groups.ts">list</a>({ ...params }) -> ZeroTrustGroupsSinglePage</code>
- <code title="delete /{account_or_zone}/{account_or_zone_id}/access/groups/{group_id}">client.zeroTrust.access.groups.<a href="./src/resources/zero-trust/access/groups.ts">delete</a>(groupId, { ...params }) -> GroupDeleteResponse</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/access/groups/{group_id}">client.zeroTrust.access.groups.<a href="./src/resources/zero-trust/access/groups.ts">get</a>(groupId, { ...params }) -> ZeroTrustGroup</code>

### ServiceTokens

Types:

- <code><a href="./src/resources/zero-trust/access/service-tokens.ts">ServiceToken</a></code>
- <code><a href="./src/resources/zero-trust/access/service-tokens.ts">ServiceTokenCreateResponse</a></code>
- <code><a href="./src/resources/zero-trust/access/service-tokens.ts">ServiceTokenRotateResponse</a></code>

Methods:

- <code title="post /{account_or_zone}/{account_or_zone_id}/access/service_tokens">client.zeroTrust.access.serviceTokens.<a href="./src/resources/zero-trust/access/service-tokens.ts">create</a>({ ...params }) -> ServiceTokenCreateResponse</code>
- <code title="put /{account_or_zone}/{account_or_zone_id}/access/service_tokens/{service_token_id}">client.zeroTrust.access.serviceTokens.<a href="./src/resources/zero-trust/access/service-tokens.ts">update</a>(serviceTokenId, { ...params }) -> ServiceToken</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/access/service_tokens">client.zeroTrust.access.serviceTokens.<a href="./src/resources/zero-trust/access/service-tokens.ts">list</a>({ ...params }) -> ServiceTokensSinglePage</code>
- <code title="delete /{account_or_zone}/{account_or_zone_id}/access/service_tokens/{service_token_id}">client.zeroTrust.access.serviceTokens.<a href="./src/resources/zero-trust/access/service-tokens.ts">delete</a>(serviceTokenId, { ...params }) -> ServiceToken</code>
- <code title="get /{account_or_zone}/{account_or_zone_id}/access/service_tokens/{service_token_id}">client.zeroTrust.access.serviceTokens.<a href="./src/resources/zero-trust/access/service-tokens.ts">get</a>(serviceTokenId, { ...params }) -> ServiceToken</code>
- <code title="post /accounts/{account_id}/access/service_tokens/{service_token_id}/refresh">client.zeroTrust.access.serviceTokens.<a href="./src/resources/zero-trust/access/service-tokens.ts">refresh</a>(serviceTokenId, { ...params }) -> ServiceToken</code>
- <code title="post /accounts/{account_id}/access/service_tokens/{service_token_id}/rotate">client.zeroTrust.access.serviceTokens.<a href="./src/resources/zero-trust/access/service-tokens.ts">rotate</a>(serviceTokenId, { ...params }) -> ServiceTokenRotateResponse</code>

### Bookmarks

Types:

- <code><a href="./src/resources/zero-trust/access/bookmarks.ts">Bookmark</a></code>
- <code><a href="./src/resources/zero-trust/access/bookmarks.ts">BookmarkDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/access/bookmarks/{bookmark_id}">client.zeroTrust.access.bookmarks.<a href="./src/resources/zero-trust/access/bookmarks.ts">create</a>(bookmarkId, { ...params }) -> Bookmark</code>
- <code title="put /accounts/{account_id}/access/bookmarks/{bookmark_id}">client.zeroTrust.access.bookmarks.<a href="./src/resources/zero-trust/access/bookmarks.ts">update</a>(bookmarkId, { ...params }) -> Bookmark</code>
- <code title="get /accounts/{account_id}/access/bookmarks">client.zeroTrust.access.bookmarks.<a href="./src/resources/zero-trust/access/bookmarks.ts">list</a>({ ...params }) -> BookmarksSinglePage</code>
- <code title="delete /accounts/{account_id}/access/bookmarks/{bookmark_id}">client.zeroTrust.access.bookmarks.<a href="./src/resources/zero-trust/access/bookmarks.ts">delete</a>(bookmarkId, { ...params }) -> BookmarkDeleteResponse</code>
- <code title="get /accounts/{account_id}/access/bookmarks/{bookmark_id}">client.zeroTrust.access.bookmarks.<a href="./src/resources/zero-trust/access/bookmarks.ts">get</a>(bookmarkId, { ...params }) -> Bookmark</code>

### Keys

Types:

- <code><a href="./src/resources/zero-trust/access/keys.ts">KeyUpdateResponse</a></code>
- <code><a href="./src/resources/zero-trust/access/keys.ts">KeyGetResponse</a></code>
- <code><a href="./src/resources/zero-trust/access/keys.ts">KeyRotateResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/access/keys">client.zeroTrust.access.keys.<a href="./src/resources/zero-trust/access/keys.ts">update</a>({ ...params }) -> KeyUpdateResponse</code>
- <code title="get /accounts/{account_id}/access/keys">client.zeroTrust.access.keys.<a href="./src/resources/zero-trust/access/keys.ts">get</a>({ ...params }) -> KeyGetResponse</code>
- <code title="post /accounts/{account_id}/access/keys/rotate">client.zeroTrust.access.keys.<a href="./src/resources/zero-trust/access/keys.ts">rotate</a>({ ...params }) -> KeyRotateResponse</code>

### Logs

#### AccessRequests

Types:

- <code><a href="./src/resources/zero-trust/access/logs/access-requests.ts">AccessRequests</a></code>
- <code><a href="./src/resources/zero-trust/access/logs/access-requests.ts">AccessRequestListResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/access/logs/access_requests">client.zeroTrust.access.logs.accessRequests.<a href="./src/resources/zero-trust/access/logs/access-requests.ts">list</a>({ ...params }) -> AccessRequestListResponse</code>

### Users

Types:

- <code><a href="./src/resources/zero-trust/access/users/users.ts">AccessUser</a></code>

Methods:

- <code title="get /accounts/{account_id}/access/users">client.zeroTrust.access.users.<a href="./src/resources/zero-trust/access/users/users.ts">list</a>({ ...params }) -> AccessUsersSinglePage</code>

#### ActiveSessions

Types:

- <code><a href="./src/resources/zero-trust/access/users/active-sessions.ts">ActiveSessionListResponse</a></code>
- <code><a href="./src/resources/zero-trust/access/users/active-sessions.ts">ActiveSessionGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/access/users/{user_id}/active_sessions">client.zeroTrust.access.users.activeSessions.<a href="./src/resources/zero-trust/access/users/active-sessions.ts">list</a>(userId, { ...params }) -> ActiveSessionListResponsesSinglePage</code>
- <code title="get /accounts/{account_id}/access/users/{user_id}/active_sessions/{nonce}">client.zeroTrust.access.users.activeSessions.<a href="./src/resources/zero-trust/access/users/active-sessions.ts">get</a>(userId, nonce, { ...params }) -> ActiveSessionGetResponse</code>

#### LastSeenIdentity

Types:

- <code><a href="./src/resources/zero-trust/access/users/last-seen-identity.ts">Identity</a></code>

Methods:

- <code title="get /accounts/{account_id}/access/users/{user_id}/last_seen_identity">client.zeroTrust.access.users.lastSeenIdentity.<a href="./src/resources/zero-trust/access/users/last-seen-identity.ts">get</a>(userId, { ...params }) -> Identity</code>

#### FailedLogins

Types:

- <code><a href="./src/resources/zero-trust/access/users/failed-logins.ts">FailedLoginListResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/access/users/{user_id}/failed_logins">client.zeroTrust.access.users.failedLogins.<a href="./src/resources/zero-trust/access/users/failed-logins.ts">list</a>(userId, { ...params }) -> FailedLoginListResponsesSinglePage</code>

### CustomPages

Types:

- <code><a href="./src/resources/zero-trust/access/custom-pages.ts">CustomPage</a></code>
- <code><a href="./src/resources/zero-trust/access/custom-pages.ts">CustomPageWithoutHTML</a></code>
- <code><a href="./src/resources/zero-trust/access/custom-pages.ts">CustomPageDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/access/custom_pages">client.zeroTrust.access.customPages.<a href="./src/resources/zero-trust/access/custom-pages.ts">create</a>({ ...params }) -> CustomPageWithoutHTML</code>
- <code title="put /accounts/{account_id}/access/custom_pages/{custom_page_id}">client.zeroTrust.access.customPages.<a href="./src/resources/zero-trust/access/custom-pages.ts">update</a>(customPageId, { ...params }) -> CustomPageWithoutHTML</code>
- <code title="get /accounts/{account_id}/access/custom_pages">client.zeroTrust.access.customPages.<a href="./src/resources/zero-trust/access/custom-pages.ts">list</a>({ ...params }) -> CustomPageWithoutHTMLsSinglePage</code>
- <code title="delete /accounts/{account_id}/access/custom_pages/{custom_page_id}">client.zeroTrust.access.customPages.<a href="./src/resources/zero-trust/access/custom-pages.ts">delete</a>(customPageId, { ...params }) -> CustomPageDeleteResponse</code>
- <code title="get /accounts/{account_id}/access/custom_pages/{custom_page_id}">client.zeroTrust.access.customPages.<a href="./src/resources/zero-trust/access/custom-pages.ts">get</a>(customPageId, { ...params }) -> CustomPage</code>

### Tags

Types:

- <code><a href="./src/resources/zero-trust/access/tags.ts">Tag</a></code>
- <code><a href="./src/resources/zero-trust/access/tags.ts">TagDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/access/tags">client.zeroTrust.access.tags.<a href="./src/resources/zero-trust/access/tags.ts">create</a>({ ...params }) -> Tag</code>
- <code title="put /accounts/{account_id}/access/tags/{tag_name}">client.zeroTrust.access.tags.<a href="./src/resources/zero-trust/access/tags.ts">update</a>(tagName, { ...params }) -> Tag</code>
- <code title="get /accounts/{account_id}/access/tags">client.zeroTrust.access.tags.<a href="./src/resources/zero-trust/access/tags.ts">list</a>({ ...params }) -> TagsSinglePage</code>
- <code title="delete /accounts/{account_id}/access/tags/{tag_name}">client.zeroTrust.access.tags.<a href="./src/resources/zero-trust/access/tags.ts">delete</a>(tagName, { ...params }) -> TagDeleteResponse</code>
- <code title="get /accounts/{account_id}/access/tags/{tag_name}">client.zeroTrust.access.tags.<a href="./src/resources/zero-trust/access/tags.ts">get</a>(tagName, { ...params }) -> Tag</code>

### Policies

Types:

- <code><a href="./src/resources/zero-trust/access/policies.ts">PolicyCreateResponse</a></code>
- <code><a href="./src/resources/zero-trust/access/policies.ts">PolicyUpdateResponse</a></code>
- <code><a href="./src/resources/zero-trust/access/policies.ts">PolicyListResponse</a></code>
- <code><a href="./src/resources/zero-trust/access/policies.ts">PolicyDeleteResponse</a></code>
- <code><a href="./src/resources/zero-trust/access/policies.ts">PolicyGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/access/policies">client.zeroTrust.access.policies.<a href="./src/resources/zero-trust/access/policies.ts">create</a>({ ...params }) -> PolicyCreateResponse</code>
- <code title="put /accounts/{account_id}/access/policies/{policy_id}">client.zeroTrust.access.policies.<a href="./src/resources/zero-trust/access/policies.ts">update</a>(policyId, { ...params }) -> PolicyUpdateResponse</code>
- <code title="get /accounts/{account_id}/access/policies">client.zeroTrust.access.policies.<a href="./src/resources/zero-trust/access/policies.ts">list</a>({ ...params }) -> PolicyListResponsesSinglePage</code>
- <code title="delete /accounts/{account_id}/access/policies/{policy_id}">client.zeroTrust.access.policies.<a href="./src/resources/zero-trust/access/policies.ts">delete</a>(policyId, { ...params }) -> PolicyDeleteResponse</code>
- <code title="get /accounts/{account_id}/access/policies/{policy_id}">client.zeroTrust.access.policies.<a href="./src/resources/zero-trust/access/policies.ts">get</a>(policyId, { ...params }) -> PolicyGetResponse</code>

## DEX

Types:

- <code><a href="./src/resources/zero-trust/dex/dex.ts">DeviceExperienceMonitor</a></code>
- <code><a href="./src/resources/zero-trust/dex/dex.ts">NetworkPath</a></code>
- <code><a href="./src/resources/zero-trust/dex/dex.ts">NetworkPathResponse</a></code>
- <code><a href="./src/resources/zero-trust/dex/dex.ts">Percentiles</a></code>

### Colos

Types:

- <code><a href="./src/resources/zero-trust/dex/colos.ts">ColoListResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/dex/colos">client.zeroTrust.dex.colos.<a href="./src/resources/zero-trust/dex/colos.ts">list</a>({ ...params }) -> ColoListResponsesSinglePage</code>

### FleetStatus

Types:

- <code><a href="./src/resources/zero-trust/dex/fleet-status/fleet-status.ts">LiveStat</a></code>
- <code><a href="./src/resources/zero-trust/dex/fleet-status/fleet-status.ts">FleetStatusLiveResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/dex/fleet-status/live">client.zeroTrust.dex.fleetStatus.<a href="./src/resources/zero-trust/dex/fleet-status/fleet-status.ts">live</a>({ ...params }) -> FleetStatusLiveResponse</code>
- <code title="get /accounts/{account_id}/dex/fleet-status/over-time">client.zeroTrust.dex.fleetStatus.<a href="./src/resources/zero-trust/dex/fleet-status/fleet-status.ts">overTime</a>({ ...params }) -> void</code>

#### Devices

Types:

- <code><a href="./src/resources/zero-trust/dex/fleet-status/devices.ts">DeviceListResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/dex/fleet-status/devices">client.zeroTrust.dex.fleetStatus.devices.<a href="./src/resources/zero-trust/dex/fleet-status/devices.ts">list</a>({ ...params }) -> DeviceListResponsesV4PagePaginationArray</code>

### HTTPTests

Types:

- <code><a href="./src/resources/zero-trust/dex/http-tests/http-tests.ts">HTTPDetails</a></code>

Methods:

- <code title="get /accounts/{account_id}/dex/http-tests/{test_id}">client.zeroTrust.dex.httpTests.<a href="./src/resources/zero-trust/dex/http-tests/http-tests.ts">get</a>(testId, { ...params }) -> HTTPDetails</code>

#### Percentiles

Types:

- <code><a href="./src/resources/zero-trust/dex/http-tests/percentiles.ts">HTTPDetailsPercentiles</a></code>
- <code><a href="./src/resources/zero-trust/dex/http-tests/percentiles.ts">TestStatOverTime</a></code>

Methods:

- <code title="get /accounts/{account_id}/dex/http-tests/{test_id}/percentiles">client.zeroTrust.dex.httpTests.percentiles.<a href="./src/resources/zero-trust/dex/http-tests/percentiles.ts">get</a>(testId, { ...params }) -> HTTPDetailsPercentiles</code>

### Tests

Types:

- <code><a href="./src/resources/zero-trust/dex/tests/tests.ts">AggregateTimePeriod</a></code>
- <code><a href="./src/resources/zero-trust/dex/tests/tests.ts">Tests</a></code>
- <code><a href="./src/resources/zero-trust/dex/tests/tests.ts">TestListResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/dex/tests">client.zeroTrust.dex.tests.<a href="./src/resources/zero-trust/dex/tests/tests.ts">list</a>({ ...params }) -> TestListResponsesV4PagePagination</code>

#### UniqueDevices

Types:

- <code><a href="./src/resources/zero-trust/dex/tests/unique-devices.ts">UniqueDevices</a></code>

Methods:

- <code title="get /accounts/{account_id}/dex/tests/unique-devices">client.zeroTrust.dex.tests.uniqueDevices.<a href="./src/resources/zero-trust/dex/tests/unique-devices.ts">list</a>({ ...params }) -> UniqueDevices</code>

### TracerouteTestResults

#### NetworkPath

Types:

- <code><a href="./src/resources/zero-trust/dex/traceroute-test-results/network-path.ts">NetworkPathGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/dex/traceroute-test-results/{test_result_id}/network-path">client.zeroTrust.dex.tracerouteTestResults.networkPath.<a href="./src/resources/zero-trust/dex/traceroute-test-results/network-path.ts">get</a>(testResultId, { ...params }) -> NetworkPathGetResponse</code>

### TracerouteTests

Types:

- <code><a href="./src/resources/zero-trust/dex/traceroute-tests.ts">Traceroute</a></code>
- <code><a href="./src/resources/zero-trust/dex/traceroute-tests.ts">TracerouteTestPercentilesResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/dex/traceroute-tests/{test_id}">client.zeroTrust.dex.tracerouteTests.<a href="./src/resources/zero-trust/dex/traceroute-tests.ts">get</a>(testId, { ...params }) -> Traceroute</code>
- <code title="get /accounts/{account_id}/dex/traceroute-tests/{test_id}/network-path">client.zeroTrust.dex.tracerouteTests.<a href="./src/resources/zero-trust/dex/traceroute-tests.ts">networkPath</a>(testId, { ...params }) -> NetworkPathResponse</code>
- <code title="get /accounts/{account_id}/dex/traceroute-tests/{test_id}/percentiles">client.zeroTrust.dex.tracerouteTests.<a href="./src/resources/zero-trust/dex/traceroute-tests.ts">percentiles</a>(testId, { ...params }) -> TracerouteTestPercentilesResponse</code>

## Tunnels

Types:

- <code><a href="./src/resources/zero-trust/tunnels/tunnels.ts">Connection</a></code>
- <code><a href="./src/resources/zero-trust/tunnels/tunnels.ts">TunnelCreateResponse</a></code>
- <code><a href="./src/resources/zero-trust/tunnels/tunnels.ts">TunnelListResponse</a></code>
- <code><a href="./src/resources/zero-trust/tunnels/tunnels.ts">TunnelDeleteResponse</a></code>
- <code><a href="./src/resources/zero-trust/tunnels/tunnels.ts">TunnelEditResponse</a></code>
- <code><a href="./src/resources/zero-trust/tunnels/tunnels.ts">TunnelGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/tunnels">client.zeroTrust.tunnels.<a href="./src/resources/zero-trust/tunnels/tunnels.ts">create</a>({ ...params }) -> TunnelCreateResponse</code>
- <code title="get /accounts/{account_id}/tunnels">client.zeroTrust.tunnels.<a href="./src/resources/zero-trust/tunnels/tunnels.ts">list</a>({ ...params }) -> TunnelListResponsesV4PagePaginationArray</code>
- <code title="delete /accounts/{account_id}/tunnels/{tunnel_id}">client.zeroTrust.tunnels.<a href="./src/resources/zero-trust/tunnels/tunnels.ts">delete</a>(tunnelId, { ...params }) -> TunnelDeleteResponse</code>
- <code title="patch /accounts/{account_id}/cfd_tunnel/{tunnel_id}">client.zeroTrust.tunnels.<a href="./src/resources/zero-trust/tunnels/tunnels.ts">edit</a>(tunnelId, { ...params }) -> TunnelEditResponse</code>
- <code title="get /accounts/{account_id}/tunnels/{tunnel_id}">client.zeroTrust.tunnels.<a href="./src/resources/zero-trust/tunnels/tunnels.ts">get</a>(tunnelId, { ...params }) -> TunnelGetResponse</code>

### Configurations

Types:

- <code><a href="./src/resources/zero-trust/tunnels/configurations.ts">ConfigurationUpdateResponse</a></code>
- <code><a href="./src/resources/zero-trust/tunnels/configurations.ts">ConfigurationGetResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/cfd_tunnel/{tunnel_id}/configurations">client.zeroTrust.tunnels.configurations.<a href="./src/resources/zero-trust/tunnels/configurations.ts">update</a>(tunnelId, { ...params }) -> ConfigurationUpdateResponse</code>
- <code title="get /accounts/{account_id}/cfd_tunnel/{tunnel_id}/configurations">client.zeroTrust.tunnels.configurations.<a href="./src/resources/zero-trust/tunnels/configurations.ts">get</a>(tunnelId, { ...params }) -> ConfigurationGetResponse</code>

### Connections

Types:

- <code><a href="./src/resources/zero-trust/tunnels/connections.ts">Client</a></code>
- <code><a href="./src/resources/zero-trust/tunnels/connections.ts">ConnectionDeleteResponse</a></code>
- <code><a href="./src/resources/zero-trust/tunnels/connections.ts">ConnectionGetResponse</a></code>

Methods:

- <code title="delete /accounts/{account_id}/tunnels/{tunnel_id}/connections">client.zeroTrust.tunnels.connections.<a href="./src/resources/zero-trust/tunnels/connections.ts">delete</a>(tunnelId, { ...params }) -> ConnectionDeleteResponse</code>
- <code title="get /accounts/{account_id}/cfd_tunnel/{tunnel_id}/connections">client.zeroTrust.tunnels.connections.<a href="./src/resources/zero-trust/tunnels/connections.ts">get</a>(tunnelId, { ...params }) -> ConnectionGetResponse | null</code>

### Token

Types:

- <code><a href="./src/resources/zero-trust/tunnels/token.ts">TokenGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/cfd_tunnel/{tunnel_id}/token">client.zeroTrust.tunnels.token.<a href="./src/resources/zero-trust/tunnels/token.ts">get</a>(tunnelId, { ...params }) -> TokenGetResponse</code>

### Connectors

Methods:

- <code title="get /accounts/{account_id}/cfd_tunnel/{tunnel_id}/connectors/{connector_id}">client.zeroTrust.tunnels.connectors.<a href="./src/resources/zero-trust/tunnels/connectors.ts">get</a>(tunnelId, connectorId, { ...params }) -> Client</code>

### Management

Types:

- <code><a href="./src/resources/zero-trust/tunnels/management.ts">ManagementCreateResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/cfd_tunnel/{tunnel_id}/management">client.zeroTrust.tunnels.management.<a href="./src/resources/zero-trust/tunnels/management.ts">create</a>(tunnelId, { ...params }) -> ManagementCreateResponse</code>

## ConnectivitySettings

Types:

- <code><a href="./src/resources/zero-trust/connectivity-settings.ts">ConnectivitySettingEditResponse</a></code>
- <code><a href="./src/resources/zero-trust/connectivity-settings.ts">ConnectivitySettingGetResponse</a></code>

Methods:

- <code title="patch /accounts/{account_id}/zerotrust/connectivity_settings">client.zeroTrust.connectivitySettings.<a href="./src/resources/zero-trust/connectivity-settings.ts">edit</a>({ ...params }) -> ConnectivitySettingEditResponse</code>
- <code title="get /accounts/{account_id}/zerotrust/connectivity_settings">client.zeroTrust.connectivitySettings.<a href="./src/resources/zero-trust/connectivity-settings.ts">get</a>({ ...params }) -> ConnectivitySettingGetResponse</code>

## DLP

### Datasets

Types:

- <code><a href="./src/resources/zero-trust/dlp/datasets/datasets.ts">Dataset</a></code>
- <code><a href="./src/resources/zero-trust/dlp/datasets/datasets.ts">DatasetArray</a></code>
- <code><a href="./src/resources/zero-trust/dlp/datasets/datasets.ts">DatasetCreation</a></code>

Methods:

- <code title="post /accounts/{account_id}/dlp/datasets">client.zeroTrust.dlp.datasets.<a href="./src/resources/zero-trust/dlp/datasets/datasets.ts">create</a>({ ...params }) -> DatasetCreation</code>
- <code title="put /accounts/{account_id}/dlp/datasets/{dataset_id}">client.zeroTrust.dlp.datasets.<a href="./src/resources/zero-trust/dlp/datasets/datasets.ts">update</a>(datasetId, { ...params }) -> Dataset</code>
- <code title="get /accounts/{account_id}/dlp/datasets">client.zeroTrust.dlp.datasets.<a href="./src/resources/zero-trust/dlp/datasets/datasets.ts">list</a>({ ...params }) -> DatasetsSinglePage</code>
- <code title="delete /accounts/{account_id}/dlp/datasets/{dataset_id}">client.zeroTrust.dlp.datasets.<a href="./src/resources/zero-trust/dlp/datasets/datasets.ts">delete</a>(datasetId, { ...params }) -> void</code>
- <code title="get /accounts/{account_id}/dlp/datasets/{dataset_id}">client.zeroTrust.dlp.datasets.<a href="./src/resources/zero-trust/dlp/datasets/datasets.ts">get</a>(datasetId, { ...params }) -> Dataset</code>

#### Upload

Types:

- <code><a href="./src/resources/zero-trust/dlp/datasets/upload.ts">NewVersion</a></code>

Methods:

- <code title="post /accounts/{account_id}/dlp/datasets/{dataset_id}/upload">client.zeroTrust.dlp.datasets.upload.<a href="./src/resources/zero-trust/dlp/datasets/upload.ts">create</a>(datasetId, { ...params }) -> NewVersion</code>
- <code title="post /accounts/{account_id}/dlp/datasets/{dataset_id}/upload/{version}">client.zeroTrust.dlp.datasets.upload.<a href="./src/resources/zero-trust/dlp/datasets/upload.ts">edit</a>(datasetId, version, { ...params }) -> Dataset</code>

### Patterns

Methods:

- <code title="post /accounts/{account_id}/dlp/patterns/validate">client.zeroTrust.dlp.patterns.<a href="./src/resources/zero-trust/dlp/patterns.ts">validate</a>({ ...params }) -> OwnershipValidation | null</code>

### PayloadLogs

Types:

- <code><a href="./src/resources/zero-trust/dlp/payload-logs.ts">PayloadLogUpdateResponse</a></code>
- <code><a href="./src/resources/zero-trust/dlp/payload-logs.ts">PayloadLogGetResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/dlp/payload_log">client.zeroTrust.dlp.payloadLogs.<a href="./src/resources/zero-trust/dlp/payload-logs.ts">update</a>({ ...params }) -> PayloadLogUpdateResponse</code>
- <code title="get /accounts/{account_id}/dlp/payload_log">client.zeroTrust.dlp.payloadLogs.<a href="./src/resources/zero-trust/dlp/payload-logs.ts">get</a>({ ...params }) -> PayloadLogGetResponse</code>

### Profiles

Types:

- <code><a href="./src/resources/zero-trust/dlp/profiles/profiles.ts">ContextAwareness</a></code>
- <code><a href="./src/resources/zero-trust/dlp/profiles/profiles.ts">Profile</a></code>
- <code><a href="./src/resources/zero-trust/dlp/profiles/profiles.ts">SkipConfiguration</a></code>
- <code><a href="./src/resources/zero-trust/dlp/profiles/profiles.ts">ProfileGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/dlp/profiles">client.zeroTrust.dlp.profiles.<a href="./src/resources/zero-trust/dlp/profiles/profiles.ts">list</a>({ ...params }) -> ProfilesSinglePage</code>
- <code title="get /accounts/{account_id}/dlp/profiles/{profile_id}">client.zeroTrust.dlp.profiles.<a href="./src/resources/zero-trust/dlp/profiles/profiles.ts">get</a>(profileId, { ...params }) -> ProfileGetResponse</code>

#### Custom

Types:

- <code><a href="./src/resources/zero-trust/dlp/profiles/custom.ts">CustomProfile</a></code>
- <code><a href="./src/resources/zero-trust/dlp/profiles/custom.ts">Pattern</a></code>
- <code><a href="./src/resources/zero-trust/dlp/profiles/custom.ts">CustomCreateResponse</a></code>
- <code><a href="./src/resources/zero-trust/dlp/profiles/custom.ts">CustomDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/dlp/profiles/custom">client.zeroTrust.dlp.profiles.custom.<a href="./src/resources/zero-trust/dlp/profiles/custom.ts">create</a>({ ...params }) -> CustomCreateResponse | null</code>
- <code title="put /accounts/{account_id}/dlp/profiles/custom/{profile_id}">client.zeroTrust.dlp.profiles.custom.<a href="./src/resources/zero-trust/dlp/profiles/custom.ts">update</a>(profileId, { ...params }) -> CustomProfile</code>
- <code title="delete /accounts/{account_id}/dlp/profiles/custom/{profile_id}">client.zeroTrust.dlp.profiles.custom.<a href="./src/resources/zero-trust/dlp/profiles/custom.ts">delete</a>(profileId, { ...params }) -> CustomDeleteResponse</code>
- <code title="get /accounts/{account_id}/dlp/profiles/custom/{profile_id}">client.zeroTrust.dlp.profiles.custom.<a href="./src/resources/zero-trust/dlp/profiles/custom.ts">get</a>(profileId, { ...params }) -> CustomProfile</code>

#### Predefined

Types:

- <code><a href="./src/resources/zero-trust/dlp/profiles/predefined.ts">PredefinedProfile</a></code>

Methods:

- <code title="put /accounts/{account_id}/dlp/profiles/predefined/{profile_id}">client.zeroTrust.dlp.profiles.predefined.<a href="./src/resources/zero-trust/dlp/profiles/predefined.ts">update</a>(profileId, { ...params }) -> PredefinedProfile</code>
- <code title="get /accounts/{account_id}/dlp/profiles/predefined/{profile_id}">client.zeroTrust.dlp.profiles.predefined.<a href="./src/resources/zero-trust/dlp/profiles/predefined.ts">get</a>(profileId, { ...params }) -> PredefinedProfile</code>

## Gateway

Types:

- <code><a href="./src/resources/zero-trust/gateway/gateway.ts">GatewayCreateResponse</a></code>
- <code><a href="./src/resources/zero-trust/gateway/gateway.ts">GatewayListResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/gateway">client.zeroTrust.gateway.<a href="./src/resources/zero-trust/gateway/gateway.ts">create</a>({ ...params }) -> GatewayCreateResponse</code>
- <code title="get /accounts/{account_id}/gateway">client.zeroTrust.gateway.<a href="./src/resources/zero-trust/gateway/gateway.ts">list</a>({ ...params }) -> GatewayListResponse</code>

### AuditSSHSettings

Types:

- <code><a href="./src/resources/zero-trust/gateway/audit-ssh-settings.ts">GatewaySettings</a></code>

Methods:

- <code title="put /accounts/{account_id}/gateway/audit_ssh_settings">client.zeroTrust.gateway.auditSSHSettings.<a href="./src/resources/zero-trust/gateway/audit-ssh-settings.ts">update</a>({ ...params }) -> GatewaySettings</code>
- <code title="get /accounts/{account_id}/gateway/audit_ssh_settings">client.zeroTrust.gateway.auditSSHSettings.<a href="./src/resources/zero-trust/gateway/audit-ssh-settings.ts">get</a>({ ...params }) -> GatewaySettings</code>

### Categories

Types:

- <code><a href="./src/resources/zero-trust/gateway/categories.ts">Category</a></code>

Methods:

- <code title="get /accounts/{account_id}/gateway/categories">client.zeroTrust.gateway.categories.<a href="./src/resources/zero-trust/gateway/categories.ts">list</a>({ ...params }) -> CategoriesSinglePage</code>

### AppTypes

Types:

- <code><a href="./src/resources/zero-trust/gateway/app-types.ts">AppType</a></code>

Methods:

- <code title="get /accounts/{account_id}/gateway/app_types">client.zeroTrust.gateway.appTypes.<a href="./src/resources/zero-trust/gateway/app-types.ts">list</a>({ ...params }) -> AppTypesSinglePage</code>

### Configurations

Types:

- <code><a href="./src/resources/zero-trust/gateway/configurations.ts">ActivityLogSettings</a></code>
- <code><a href="./src/resources/zero-trust/gateway/configurations.ts">AntiVirusSettings</a></code>
- <code><a href="./src/resources/zero-trust/gateway/configurations.ts">BlockPageSettings</a></code>
- <code><a href="./src/resources/zero-trust/gateway/configurations.ts">BodyScanningSettings</a></code>
- <code><a href="./src/resources/zero-trust/gateway/configurations.ts">BrowserIsolationSettings</a></code>
- <code><a href="./src/resources/zero-trust/gateway/configurations.ts">CustomCertificateSettings</a></code>
- <code><a href="./src/resources/zero-trust/gateway/configurations.ts">ExtendedEmailMatching</a></code>
- <code><a href="./src/resources/zero-trust/gateway/configurations.ts">FipsSettings</a></code>
- <code><a href="./src/resources/zero-trust/gateway/configurations.ts">GatewayConfigurationSettings</a></code>
- <code><a href="./src/resources/zero-trust/gateway/configurations.ts">NotificationSettings</a></code>
- <code><a href="./src/resources/zero-trust/gateway/configurations.ts">ProtocolDetection</a></code>
- <code><a href="./src/resources/zero-trust/gateway/configurations.ts">TLSSettings</a></code>
- <code><a href="./src/resources/zero-trust/gateway/configurations.ts">ConfigurationUpdateResponse</a></code>
- <code><a href="./src/resources/zero-trust/gateway/configurations.ts">ConfigurationEditResponse</a></code>
- <code><a href="./src/resources/zero-trust/gateway/configurations.ts">ConfigurationGetResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/gateway/configuration">client.zeroTrust.gateway.configurations.<a href="./src/resources/zero-trust/gateway/configurations.ts">update</a>({ ...params }) -> ConfigurationUpdateResponse</code>
- <code title="patch /accounts/{account_id}/gateway/configuration">client.zeroTrust.gateway.configurations.<a href="./src/resources/zero-trust/gateway/configurations.ts">edit</a>({ ...params }) -> ConfigurationEditResponse</code>
- <code title="get /accounts/{account_id}/gateway/configuration">client.zeroTrust.gateway.configurations.<a href="./src/resources/zero-trust/gateway/configurations.ts">get</a>({ ...params }) -> ConfigurationGetResponse</code>

### Lists

Types:

- <code><a href="./src/resources/zero-trust/gateway/lists/lists.ts">GatewayItem</a></code>
- <code><a href="./src/resources/zero-trust/gateway/lists/lists.ts">GatewayList</a></code>
- <code><a href="./src/resources/zero-trust/gateway/lists/lists.ts">ListCreateResponse</a></code>
- <code><a href="./src/resources/zero-trust/gateway/lists/lists.ts">ListDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/gateway/lists">client.zeroTrust.gateway.lists.<a href="./src/resources/zero-trust/gateway/lists/lists.ts">create</a>({ ...params }) -> ListCreateResponse</code>
- <code title="put /accounts/{account_id}/gateway/lists/{list_id}">client.zeroTrust.gateway.lists.<a href="./src/resources/zero-trust/gateway/lists/lists.ts">update</a>(listId, { ...params }) -> GatewayList</code>
- <code title="get /accounts/{account_id}/gateway/lists">client.zeroTrust.gateway.lists.<a href="./src/resources/zero-trust/gateway/lists/lists.ts">list</a>({ ...params }) -> GatewayListsSinglePage</code>
- <code title="delete /accounts/{account_id}/gateway/lists/{list_id}">client.zeroTrust.gateway.lists.<a href="./src/resources/zero-trust/gateway/lists/lists.ts">delete</a>(listId, { ...params }) -> ListDeleteResponse</code>
- <code title="patch /accounts/{account_id}/gateway/lists/{list_id}">client.zeroTrust.gateway.lists.<a href="./src/resources/zero-trust/gateway/lists/lists.ts">edit</a>(listId, { ...params }) -> GatewayList</code>
- <code title="get /accounts/{account_id}/gateway/lists/{list_id}">client.zeroTrust.gateway.lists.<a href="./src/resources/zero-trust/gateway/lists/lists.ts">get</a>(listId, { ...params }) -> GatewayList</code>

#### Items

Types:

- <code><a href="./src/resources/zero-trust/gateway/lists/items.ts">ItemListResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/gateway/lists/{list_id}/items">client.zeroTrust.gateway.lists.items.<a href="./src/resources/zero-trust/gateway/lists/items.ts">list</a>(listId, { ...params }) -> ItemListResponsesSinglePage</code>

### Locations

Types:

- <code><a href="./src/resources/zero-trust/gateway/locations.ts">Location</a></code>
- <code><a href="./src/resources/zero-trust/gateway/locations.ts">LocationDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/gateway/locations">client.zeroTrust.gateway.locations.<a href="./src/resources/zero-trust/gateway/locations.ts">create</a>({ ...params }) -> Location</code>
- <code title="put /accounts/{account_id}/gateway/locations/{location_id}">client.zeroTrust.gateway.locations.<a href="./src/resources/zero-trust/gateway/locations.ts">update</a>(locationId, { ...params }) -> Location</code>
- <code title="get /accounts/{account_id}/gateway/locations">client.zeroTrust.gateway.locations.<a href="./src/resources/zero-trust/gateway/locations.ts">list</a>({ ...params }) -> LocationsSinglePage</code>
- <code title="delete /accounts/{account_id}/gateway/locations/{location_id}">client.zeroTrust.gateway.locations.<a href="./src/resources/zero-trust/gateway/locations.ts">delete</a>(locationId, { ...params }) -> LocationDeleteResponse</code>
- <code title="get /accounts/{account_id}/gateway/locations/{location_id}">client.zeroTrust.gateway.locations.<a href="./src/resources/zero-trust/gateway/locations.ts">get</a>(locationId, { ...params }) -> Location</code>

### Logging

Types:

- <code><a href="./src/resources/zero-trust/gateway/logging.ts">LoggingSetting</a></code>

Methods:

- <code title="put /accounts/{account_id}/gateway/logging">client.zeroTrust.gateway.logging.<a href="./src/resources/zero-trust/gateway/logging.ts">update</a>({ ...params }) -> LoggingSetting</code>
- <code title="get /accounts/{account_id}/gateway/logging">client.zeroTrust.gateway.logging.<a href="./src/resources/zero-trust/gateway/logging.ts">get</a>({ ...params }) -> LoggingSetting</code>

### ProxyEndpoints

Types:

- <code><a href="./src/resources/zero-trust/gateway/proxy-endpoints.ts">GatewayIPs</a></code>
- <code><a href="./src/resources/zero-trust/gateway/proxy-endpoints.ts">ProxyEndpoint</a></code>
- <code><a href="./src/resources/zero-trust/gateway/proxy-endpoints.ts">ProxyEndpointDeleteResponse</a></code>
- <code><a href="./src/resources/zero-trust/gateway/proxy-endpoints.ts">ProxyEndpointGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/gateway/proxy_endpoints">client.zeroTrust.gateway.proxyEndpoints.<a href="./src/resources/zero-trust/gateway/proxy-endpoints.ts">create</a>({ ...params }) -> ProxyEndpoint</code>
- <code title="get /accounts/{account_id}/gateway/proxy_endpoints">client.zeroTrust.gateway.proxyEndpoints.<a href="./src/resources/zero-trust/gateway/proxy-endpoints.ts">list</a>({ ...params }) -> ProxyEndpoint</code>
- <code title="delete /accounts/{account_id}/gateway/proxy_endpoints/{proxy_endpoint_id}">client.zeroTrust.gateway.proxyEndpoints.<a href="./src/resources/zero-trust/gateway/proxy-endpoints.ts">delete</a>(proxyEndpointId, { ...params }) -> ProxyEndpointDeleteResponse</code>
- <code title="patch /accounts/{account_id}/gateway/proxy_endpoints/{proxy_endpoint_id}">client.zeroTrust.gateway.proxyEndpoints.<a href="./src/resources/zero-trust/gateway/proxy-endpoints.ts">edit</a>(proxyEndpointId, { ...params }) -> ProxyEndpoint</code>
- <code title="get /accounts/{account_id}/gateway/proxy_endpoints/{proxy_endpoint_id}">client.zeroTrust.gateway.proxyEndpoints.<a href="./src/resources/zero-trust/gateway/proxy-endpoints.ts">get</a>(proxyEndpointId, { ...params }) -> ProxyEndpointGetResponse | null</code>

### Rules

Types:

- <code><a href="./src/resources/zero-trust/gateway/rules.ts">DNSResolverSettingsV4</a></code>
- <code><a href="./src/resources/zero-trust/gateway/rules.ts">DNSResolverSettingsV6</a></code>
- <code><a href="./src/resources/zero-trust/gateway/rules.ts">GatewayFilter</a></code>
- <code><a href="./src/resources/zero-trust/gateway/rules.ts">GatewayRule</a></code>
- <code><a href="./src/resources/zero-trust/gateway/rules.ts">RuleSetting</a></code>
- <code><a href="./src/resources/zero-trust/gateway/rules.ts">Schedule</a></code>
- <code><a href="./src/resources/zero-trust/gateway/rules.ts">RuleDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/gateway/rules">client.zeroTrust.gateway.rules.<a href="./src/resources/zero-trust/gateway/rules.ts">create</a>({ ...params }) -> GatewayRule</code>
- <code title="put /accounts/{account_id}/gateway/rules/{rule_id}">client.zeroTrust.gateway.rules.<a href="./src/resources/zero-trust/gateway/rules.ts">update</a>(ruleId, { ...params }) -> GatewayRule</code>
- <code title="get /accounts/{account_id}/gateway/rules">client.zeroTrust.gateway.rules.<a href="./src/resources/zero-trust/gateway/rules.ts">list</a>({ ...params }) -> GatewayRulesSinglePage</code>
- <code title="delete /accounts/{account_id}/gateway/rules/{rule_id}">client.zeroTrust.gateway.rules.<a href="./src/resources/zero-trust/gateway/rules.ts">delete</a>(ruleId, { ...params }) -> RuleDeleteResponse</code>
- <code title="get /accounts/{account_id}/gateway/rules/{rule_id}">client.zeroTrust.gateway.rules.<a href="./src/resources/zero-trust/gateway/rules.ts">get</a>(ruleId, { ...params }) -> GatewayRule</code>

### Certificates

Types:

- <code><a href="./src/resources/zero-trust/gateway/certificates.ts">CertificateCreateResponse</a></code>
- <code><a href="./src/resources/zero-trust/gateway/certificates.ts">CertificateListResponse</a></code>
- <code><a href="./src/resources/zero-trust/gateway/certificates.ts">CertificateDeleteResponse</a></code>
- <code><a href="./src/resources/zero-trust/gateway/certificates.ts">CertificateGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/gateway/certificates">client.zeroTrust.gateway.certificates.<a href="./src/resources/zero-trust/gateway/certificates.ts">create</a>({ ...params }) -> CertificateCreateResponse</code>
- <code title="get /accounts/{account_id}/gateway/certificates">client.zeroTrust.gateway.certificates.<a href="./src/resources/zero-trust/gateway/certificates.ts">list</a>({ ...params }) -> CertificateListResponsesSinglePage</code>
- <code title="delete /accounts/{account_id}/gateway/certificates/{certificate_id}">client.zeroTrust.gateway.certificates.<a href="./src/resources/zero-trust/gateway/certificates.ts">delete</a>(certificateId, { ...params }) -> CertificateDeleteResponse</code>
- <code title="get /accounts/{account_id}/gateway/certificates/{certificate_id}">client.zeroTrust.gateway.certificates.<a href="./src/resources/zero-trust/gateway/certificates.ts">get</a>(certificateId, { ...params }) -> CertificateGetResponse</code>

## Networks

### Routes

Types:

- <code><a href="./src/resources/zero-trust/networks/routes/routes.ts">NetworkRoute</a></code>
- <code><a href="./src/resources/zero-trust/networks/routes/routes.ts">Route</a></code>
- <code><a href="./src/resources/zero-trust/networks/routes/routes.ts">Teamnet</a></code>

Methods:

- <code title="post /accounts/{account_id}/teamnet/routes">client.zeroTrust.networks.routes.<a href="./src/resources/zero-trust/networks/routes/routes.ts">create</a>({ ...params }) -> Route</code>
- <code title="get /accounts/{account_id}/teamnet/routes">client.zeroTrust.networks.routes.<a href="./src/resources/zero-trust/networks/routes/routes.ts">list</a>({ ...params }) -> TeamnetsV4PagePaginationArray</code>
- <code title="delete /accounts/{account_id}/teamnet/routes/{route_id}">client.zeroTrust.networks.routes.<a href="./src/resources/zero-trust/networks/routes/routes.ts">delete</a>(routeId, { ...params }) -> Route</code>
- <code title="patch /accounts/{account_id}/teamnet/routes/{route_id}">client.zeroTrust.networks.routes.<a href="./src/resources/zero-trust/networks/routes/routes.ts">edit</a>(routeId, { ...params }) -> Route</code>

#### IPs

Methods:

- <code title="get /accounts/{account_id}/teamnet/routes/ip/{ip}">client.zeroTrust.networks.routes.ips.<a href="./src/resources/zero-trust/networks/routes/ips.ts">get</a>(ip, { ...params }) -> Teamnet</code>

#### Networks

Methods:

- <code title="post /accounts/{account_id}/teamnet/routes/network/{ip_network_encoded}">client.zeroTrust.networks.routes.networks.<a href="./src/resources/zero-trust/networks/routes/networks.ts">create</a>(ipNetworkEncoded, { ...params }) -> Route</code>
- <code title="delete /accounts/{account_id}/teamnet/routes/network/{ip_network_encoded}">client.zeroTrust.networks.routes.networks.<a href="./src/resources/zero-trust/networks/routes/networks.ts">delete</a>(ipNetworkEncoded, { ...params }) -> Route</code>
- <code title="patch /accounts/{account_id}/teamnet/routes/network/{ip_network_encoded}">client.zeroTrust.networks.routes.networks.<a href="./src/resources/zero-trust/networks/routes/networks.ts">edit</a>(ipNetworkEncoded, { ...params }) -> Route</code>

### VirtualNetworks

Types:

- <code><a href="./src/resources/zero-trust/networks/virtual-networks.ts">VirtualNetwork</a></code>
- <code><a href="./src/resources/zero-trust/networks/virtual-networks.ts">VirtualNetworkCreateResponse</a></code>
- <code><a href="./src/resources/zero-trust/networks/virtual-networks.ts">VirtualNetworkDeleteResponse</a></code>
- <code><a href="./src/resources/zero-trust/networks/virtual-networks.ts">VirtualNetworkEditResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/teamnet/virtual_networks">client.zeroTrust.networks.virtualNetworks.<a href="./src/resources/zero-trust/networks/virtual-networks.ts">create</a>({ ...params }) -> VirtualNetworkCreateResponse</code>
- <code title="get /accounts/{account_id}/teamnet/virtual_networks">client.zeroTrust.networks.virtualNetworks.<a href="./src/resources/zero-trust/networks/virtual-networks.ts">list</a>({ ...params }) -> VirtualNetworksSinglePage</code>
- <code title="delete /accounts/{account_id}/teamnet/virtual_networks/{virtual_network_id}">client.zeroTrust.networks.virtualNetworks.<a href="./src/resources/zero-trust/networks/virtual-networks.ts">delete</a>(virtualNetworkId, { ...params }) -> VirtualNetworkDeleteResponse</code>
- <code title="patch /accounts/{account_id}/teamnet/virtual_networks/{virtual_network_id}">client.zeroTrust.networks.virtualNetworks.<a href="./src/resources/zero-trust/networks/virtual-networks.ts">edit</a>(virtualNetworkId, { ...params }) -> VirtualNetworkEditResponse</code>

## RiskScoring

Types:

- <code><a href="./src/resources/zero-trust/risk-scoring/risk-scoring.ts">RiskScoringGetResponse</a></code>
- <code><a href="./src/resources/zero-trust/risk-scoring/risk-scoring.ts">RiskScoringResetResponse</a></code>

Methods:

- <code title="get /accounts/{account_identifier}/zt_risk_scoring/{user_id}">client.zeroTrust.riskScoring.<a href="./src/resources/zero-trust/risk-scoring/risk-scoring.ts">get</a>(accountIdentifier, userId, { ...params }) -> RiskScoringGetResponse</code>
- <code title="post /accounts/{account_identifier}/zt_risk_scoring/{user_id}/reset">client.zeroTrust.riskScoring.<a href="./src/resources/zero-trust/risk-scoring/risk-scoring.ts">reset</a>(accountIdentifier, userId) -> RiskScoringResetResponse</code>

### Behaviours

Types:

- <code><a href="./src/resources/zero-trust/risk-scoring/behaviours.ts">BehaviourUpdateResponse</a></code>
- <code><a href="./src/resources/zero-trust/risk-scoring/behaviours.ts">BehaviourGetResponse</a></code>

Methods:

- <code title="put /accounts/{account_identifier}/zt_risk_scoring/behaviors">client.zeroTrust.riskScoring.behaviours.<a href="./src/resources/zero-trust/risk-scoring/behaviours.ts">update</a>(accountIdentifier, { ...params }) -> BehaviourUpdateResponse</code>
- <code title="get /accounts/{account_identifier}/zt_risk_scoring/behaviors">client.zeroTrust.riskScoring.behaviours.<a href="./src/resources/zero-trust/risk-scoring/behaviours.ts">get</a>(accountIdentifier) -> BehaviourGetResponse</code>

### Summary

Types:

- <code><a href="./src/resources/zero-trust/risk-scoring/summary.ts">SummaryGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_identifier}/zt_risk_scoring/summary">client.zeroTrust.riskScoring.summary.<a href="./src/resources/zero-trust/risk-scoring/summary.ts">get</a>(accountIdentifier, { ...params }) -> SummaryGetResponse</code>

### Integrations

Types:

- <code><a href="./src/resources/zero-trust/risk-scoring/integrations/integrations.ts">IntegrationCreateResponse</a></code>
- <code><a href="./src/resources/zero-trust/risk-scoring/integrations/integrations.ts">IntegrationUpdateResponse</a></code>
- <code><a href="./src/resources/zero-trust/risk-scoring/integrations/integrations.ts">IntegrationListResponse</a></code>
- <code><a href="./src/resources/zero-trust/risk-scoring/integrations/integrations.ts">IntegrationDeleteResponse</a></code>
- <code><a href="./src/resources/zero-trust/risk-scoring/integrations/integrations.ts">IntegrationGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/zt_risk_scoring/integrations">client.zeroTrust.riskScoring.integrations.<a href="./src/resources/zero-trust/risk-scoring/integrations/integrations.ts">create</a>({ ...params }) -> IntegrationCreateResponse</code>
- <code title="put /accounts/{account_id}/zt_risk_scoring/integrations/{integration_id}">client.zeroTrust.riskScoring.integrations.<a href="./src/resources/zero-trust/risk-scoring/integrations/integrations.ts">update</a>(integrationId, { ...params }) -> IntegrationUpdateResponse</code>
- <code title="get /accounts/{account_id}/zt_risk_scoring/integrations">client.zeroTrust.riskScoring.integrations.<a href="./src/resources/zero-trust/risk-scoring/integrations/integrations.ts">list</a>({ ...params }) -> IntegrationListResponsesSinglePage</code>
- <code title="delete /accounts/{account_id}/zt_risk_scoring/integrations/{integration_id}">client.zeroTrust.riskScoring.integrations.<a href="./src/resources/zero-trust/risk-scoring/integrations/integrations.ts">delete</a>(integrationId, { ...params }) -> IntegrationDeleteResponse</code>
- <code title="get /accounts/{account_id}/zt_risk_scoring/integrations/{integration_id}">client.zeroTrust.riskScoring.integrations.<a href="./src/resources/zero-trust/risk-scoring/integrations/integrations.ts">get</a>(integrationId, { ...params }) -> IntegrationGetResponse</code>

#### References

Types:

- <code><a href="./src/resources/zero-trust/risk-scoring/integrations/references.ts">ReferenceGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/zt_risk_scoring/integrations/reference_id/{reference_id}">client.zeroTrust.riskScoring.integrations.references.<a href="./src/resources/zero-trust/risk-scoring/integrations/references.ts">get</a>(referenceId, { ...params }) -> ReferenceGetResponse</code>

# Challenges

## Widgets

Types:

- <code><a href="./src/resources/challenges/widgets.ts">Widget</a></code>
- <code><a href="./src/resources/challenges/widgets.ts">WidgetDomain</a></code>
- <code><a href="./src/resources/challenges/widgets.ts">WidgetListResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/challenges/widgets">client.challenges.widgets.<a href="./src/resources/challenges/widgets.ts">create</a>({ ...params }) -> Widget</code>
- <code title="put /accounts/{account_id}/challenges/widgets/{sitekey}">client.challenges.widgets.<a href="./src/resources/challenges/widgets.ts">update</a>(sitekey, { ...params }) -> Widget</code>
- <code title="get /accounts/{account_id}/challenges/widgets">client.challenges.widgets.<a href="./src/resources/challenges/widgets.ts">list</a>({ ...params }) -> WidgetListResponsesV4PagePaginationArray</code>
- <code title="delete /accounts/{account_id}/challenges/widgets/{sitekey}">client.challenges.widgets.<a href="./src/resources/challenges/widgets.ts">delete</a>(sitekey, { ...params }) -> Widget</code>
- <code title="get /accounts/{account_id}/challenges/widgets/{sitekey}">client.challenges.widgets.<a href="./src/resources/challenges/widgets.ts">get</a>(sitekey, { ...params }) -> Widget</code>
- <code title="post /accounts/{account_id}/challenges/widgets/{sitekey}/rotate_secret">client.challenges.widgets.<a href="./src/resources/challenges/widgets.ts">rotateSecret</a>(sitekey, { ...params }) -> Widget</code>

# Hyperdrive

Types:

- <code><a href="./src/resources/hyperdrive/hyperdrive.ts">Configuration</a></code>
- <code><a href="./src/resources/hyperdrive/hyperdrive.ts">Hyperdrive</a></code>

## Configs

Types:

- <code><a href="./src/resources/hyperdrive/configs.ts">ConfigDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/hyperdrive/configs">client.hyperdrive.configs.<a href="./src/resources/hyperdrive/configs.ts">create</a>({ ...params }) -> Hyperdrive | null</code>
- <code title="put /accounts/{account_id}/hyperdrive/configs/{hyperdrive_id}">client.hyperdrive.configs.<a href="./src/resources/hyperdrive/configs.ts">update</a>(hyperdriveId, { ...params }) -> Hyperdrive | null</code>
- <code title="get /accounts/{account_id}/hyperdrive/configs">client.hyperdrive.configs.<a href="./src/resources/hyperdrive/configs.ts">list</a>({ ...params }) -> HyperdrivesSinglePage</code>
- <code title="delete /accounts/{account_id}/hyperdrive/configs/{hyperdrive_id}">client.hyperdrive.configs.<a href="./src/resources/hyperdrive/configs.ts">delete</a>(hyperdriveId, { ...params }) -> ConfigDeleteResponse</code>
- <code title="patch /accounts/{account_id}/hyperdrive/configs/{hyperdrive_id}">client.hyperdrive.configs.<a href="./src/resources/hyperdrive/configs.ts">edit</a>(hyperdriveId, { ...params }) -> Hyperdrive | null</code>
- <code title="get /accounts/{account_id}/hyperdrive/configs/{hyperdrive_id}">client.hyperdrive.configs.<a href="./src/resources/hyperdrive/configs.ts">get</a>(hyperdriveId, { ...params }) -> Hyperdrive | null</code>

# RUM

## SiteInfo

Types:

- <code><a href="./src/resources/rum/site-info.ts">Site</a></code>
- <code><a href="./src/resources/rum/site-info.ts">SiteInfoDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/rum/site_info">client.rum.siteInfo.<a href="./src/resources/rum/site-info.ts">create</a>({ ...params }) -> Site</code>
- <code title="put /accounts/{account_id}/rum/site_info/{site_id}">client.rum.siteInfo.<a href="./src/resources/rum/site-info.ts">update</a>(siteId, { ...params }) -> Site</code>
- <code title="get /accounts/{account_id}/rum/site_info/list">client.rum.siteInfo.<a href="./src/resources/rum/site-info.ts">list</a>({ ...params }) -> SitesV4PagePaginationArray</code>
- <code title="delete /accounts/{account_id}/rum/site_info/{site_id}">client.rum.siteInfo.<a href="./src/resources/rum/site-info.ts">delete</a>(siteId, { ...params }) -> SiteInfoDeleteResponse</code>
- <code title="get /accounts/{account_id}/rum/site_info/{site_id}">client.rum.siteInfo.<a href="./src/resources/rum/site-info.ts">get</a>(siteId, { ...params }) -> Site</code>

## Rules

Types:

- <code><a href="./src/resources/rum/rules.ts">RUMRule</a></code>
- <code><a href="./src/resources/rum/rules.ts">RuleListResponse</a></code>
- <code><a href="./src/resources/rum/rules.ts">RuleDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/rum/v2/{ruleset_id}/rule">client.rum.rules.<a href="./src/resources/rum/rules.ts">create</a>(rulesetId, { ...params }) -> RUMRule</code>
- <code title="put /accounts/{account_id}/rum/v2/{ruleset_id}/rule/{rule_id}">client.rum.rules.<a href="./src/resources/rum/rules.ts">update</a>(rulesetId, ruleId, { ...params }) -> RUMRule</code>
- <code title="get /accounts/{account_id}/rum/v2/{ruleset_id}/rules">client.rum.rules.<a href="./src/resources/rum/rules.ts">list</a>(rulesetId, { ...params }) -> RuleListResponse</code>
- <code title="delete /accounts/{account_id}/rum/v2/{ruleset_id}/rule/{rule_id}">client.rum.rules.<a href="./src/resources/rum/rules.ts">delete</a>(rulesetId, ruleId, { ...params }) -> RuleDeleteResponse</code>

# Vectorize

## Indexes

Types:

- <code><a href="./src/resources/vectorize/indexes.ts">CreateIndex</a></code>
- <code><a href="./src/resources/vectorize/indexes.ts">IndexDeleteVectorsByID</a></code>
- <code><a href="./src/resources/vectorize/indexes.ts">IndexDimensionConfiguration</a></code>
- <code><a href="./src/resources/vectorize/indexes.ts">IndexInsert</a></code>
- <code><a href="./src/resources/vectorize/indexes.ts">IndexQuery</a></code>
- <code><a href="./src/resources/vectorize/indexes.ts">IndexUpsert</a></code>
- <code><a href="./src/resources/vectorize/indexes.ts">IndexDeleteResponse</a></code>
- <code><a href="./src/resources/vectorize/indexes.ts">IndexGetByIDsResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/vectorize/indexes">client.vectorize.indexes.<a href="./src/resources/vectorize/indexes.ts">create</a>({ ...params }) -> CreateIndex | null</code>
- <code title="put /accounts/{account_id}/vectorize/indexes/{index_name}">client.vectorize.indexes.<a href="./src/resources/vectorize/indexes.ts">update</a>(indexName, { ...params }) -> CreateIndex | null</code>
- <code title="get /accounts/{account_id}/vectorize/indexes">client.vectorize.indexes.<a href="./src/resources/vectorize/indexes.ts">list</a>({ ...params }) -> CreateIndicesSinglePage</code>
- <code title="delete /accounts/{account_id}/vectorize/indexes/{index_name}">client.vectorize.indexes.<a href="./src/resources/vectorize/indexes.ts">delete</a>(indexName, { ...params }) -> IndexDeleteResponse</code>
- <code title="post /accounts/{account_id}/vectorize/indexes/{index_name}/delete-by-ids">client.vectorize.indexes.<a href="./src/resources/vectorize/indexes.ts">deleteByIds</a>(indexName, { ...params }) -> IndexDeleteVectorsByID | null</code>
- <code title="get /accounts/{account_id}/vectorize/indexes/{index_name}">client.vectorize.indexes.<a href="./src/resources/vectorize/indexes.ts">get</a>(indexName, { ...params }) -> CreateIndex | null</code>
- <code title="post /accounts/{account_id}/vectorize/indexes/{index_name}/get-by-ids">client.vectorize.indexes.<a href="./src/resources/vectorize/indexes.ts">getByIds</a>(indexName, { ...params }) -> IndexGetByIDsResponse | null</code>
- <code title="post /accounts/{account_id}/vectorize/indexes/{index_name}/insert">client.vectorize.indexes.<a href="./src/resources/vectorize/indexes.ts">insert</a>(indexName, { ...params }) -> IndexInsert | null</code>
- <code title="post /accounts/{account_id}/vectorize/indexes/{index_name}/query">client.vectorize.indexes.<a href="./src/resources/vectorize/indexes.ts">query</a>(indexName, { ...params }) -> IndexQuery | null</code>
- <code title="post /accounts/{account_id}/vectorize/indexes/{index_name}/upsert">client.vectorize.indexes.<a href="./src/resources/vectorize/indexes.ts">upsert</a>(indexName, { ...params }) -> IndexUpsert | null</code>

# URLScanner

Types:

- <code><a href="./src/resources/url-scanner/url-scanner.ts">URLScannerScanResponse</a></code>

Methods:

- <code title="get /accounts/{accountId}/urlscanner/scan">client.urlScanner.<a href="./src/resources/url-scanner/url-scanner.ts">scan</a>(accountId, { ...params }) -> URLScannerScanResponse</code>

## Scans

Types:

- <code><a href="./src/resources/url-scanner/scans.ts">URLScannerDomain</a></code>
- <code><a href="./src/resources/url-scanner/scans.ts">URLScannerTask</a></code>
- <code><a href="./src/resources/url-scanner/scans.ts">ScanCreateResponse</a></code>
- <code><a href="./src/resources/url-scanner/scans.ts">ScanGetResponse</a></code>
- <code><a href="./src/resources/url-scanner/scans.ts">ScanHarResponse</a></code>

Methods:

- <code title="post /accounts/{accountId}/urlscanner/scan">client.urlScanner.scans.<a href="./src/resources/url-scanner/scans.ts">create</a>(accountId, { ...params }) -> ScanCreateResponse</code>
- <code title="get /accounts/{accountId}/urlscanner/scan/{scanId}">client.urlScanner.scans.<a href="./src/resources/url-scanner/scans.ts">get</a>(accountId, scanId, { ...params }) -> ScanGetResponse</code>
- <code title="get /accounts/{accountId}/urlscanner/scan/{scanId}/har">client.urlScanner.scans.<a href="./src/resources/url-scanner/scans.ts">har</a>(accountId, scanId) -> ScanHarResponse</code>
- <code title="get /accounts/{accountId}/urlscanner/scan/{scanId}/screenshot">client.urlScanner.scans.<a href="./src/resources/url-scanner/scans.ts">screenshot</a>(accountId, scanId, { ...params }) -> Response</code>

# Radar

## Annotations

### Outages

Types:

- <code><a href="./src/resources/radar/annotations/outages.ts">OutageGetResponse</a></code>
- <code><a href="./src/resources/radar/annotations/outages.ts">OutageLocationsResponse</a></code>

Methods:

- <code title="get /radar/annotations/outages">client.radar.annotations.outages.<a href="./src/resources/radar/annotations/outages.ts">get</a>({ ...params }) -> OutageGetResponse</code>
- <code title="get /radar/annotations/outages/locations">client.radar.annotations.outages.<a href="./src/resources/radar/annotations/outages.ts">locations</a>({ ...params }) -> OutageLocationsResponse</code>

## BGP

Types:

- <code><a href="./src/resources/radar/bgp/bgp.ts">BGPTimeseriesResponse</a></code>

Methods:

- <code title="get /radar/bgp/timeseries">client.radar.bgp.<a href="./src/resources/radar/bgp/bgp.ts">timeseries</a>({ ...params }) -> BGPTimeseriesResponse</code>

### Leaks

#### Events

Types:

- <code><a href="./src/resources/radar/bgp/leaks/events.ts">EventListResponse</a></code>

Methods:

- <code title="get /radar/bgp/leaks/events">client.radar.bgp.leaks.events.<a href="./src/resources/radar/bgp/leaks/events.ts">list</a>({ ...params }) -> EventListResponsesV4PagePagination</code>

### Top

Types:

- <code><a href="./src/resources/radar/bgp/top/top.ts">TopPrefixesResponse</a></code>

Methods:

- <code title="get /radar/bgp/top/prefixes">client.radar.bgp.top.<a href="./src/resources/radar/bgp/top/top.ts">prefixes</a>({ ...params }) -> TopPrefixesResponse</code>

#### Ases

Types:

- <code><a href="./src/resources/radar/bgp/top/ases.ts">AseGetResponse</a></code>
- <code><a href="./src/resources/radar/bgp/top/ases.ts">AsePrefixesResponse</a></code>

Methods:

- <code title="get /radar/bgp/top/ases">client.radar.bgp.top.ases.<a href="./src/resources/radar/bgp/top/ases.ts">get</a>({ ...params }) -> AseGetResponse</code>
- <code title="get /radar/bgp/top/ases/prefixes">client.radar.bgp.top.ases.<a href="./src/resources/radar/bgp/top/ases.ts">prefixes</a>({ ...params }) -> AsePrefixesResponse</code>

### Hijacks

#### Events

Types:

- <code><a href="./src/resources/radar/bgp/hijacks/events.ts">EventListResponse</a></code>

Methods:

- <code title="get /radar/bgp/hijacks/events">client.radar.bgp.hijacks.events.<a href="./src/resources/radar/bgp/hijacks/events.ts">list</a>({ ...params }) -> EventListResponsesV4PagePagination</code>

### Routes

Types:

- <code><a href="./src/resources/radar/bgp/routes.ts">RouteAsesResponse</a></code>
- <code><a href="./src/resources/radar/bgp/routes.ts">RouteMoasResponse</a></code>
- <code><a href="./src/resources/radar/bgp/routes.ts">RoutePfx2asResponse</a></code>
- <code><a href="./src/resources/radar/bgp/routes.ts">RouteStatsResponse</a></code>

Methods:

- <code title="get /radar/bgp/routes/ases">client.radar.bgp.routes.<a href="./src/resources/radar/bgp/routes.ts">ases</a>({ ...params }) -> RouteAsesResponse</code>
- <code title="get /radar/bgp/routes/moas">client.radar.bgp.routes.<a href="./src/resources/radar/bgp/routes.ts">moas</a>({ ...params }) -> RouteMoasResponse</code>
- <code title="get /radar/bgp/routes/pfx2as">client.radar.bgp.routes.<a href="./src/resources/radar/bgp/routes.ts">pfx2as</a>({ ...params }) -> RoutePfx2asResponse</code>
- <code title="get /radar/bgp/routes/stats">client.radar.bgp.routes.<a href="./src/resources/radar/bgp/routes.ts">stats</a>({ ...params }) -> RouteStatsResponse</code>

### IPs

Types:

- <code><a href="./src/resources/radar/bgp/ips.ts">IPTimeseriesResponse</a></code>

Methods:

- <code title="get /radar/bgp/ips/timeseries">client.radar.bgp.ips.<a href="./src/resources/radar/bgp/ips.ts">timeseries</a>({ ...params }) -> IPTimeseriesResponse</code>

## Datasets

Types:

- <code><a href="./src/resources/radar/datasets.ts">DatasetListResponse</a></code>
- <code><a href="./src/resources/radar/datasets.ts">DatasetDownloadResponse</a></code>
- <code><a href="./src/resources/radar/datasets.ts">DatasetGetResponse</a></code>

Methods:

- <code title="get /radar/datasets">client.radar.datasets.<a href="./src/resources/radar/datasets.ts">list</a>({ ...params }) -> DatasetListResponse</code>
- <code title="post /radar/datasets/download">client.radar.datasets.<a href="./src/resources/radar/datasets.ts">download</a>({ ...params }) -> DatasetDownloadResponse</code>
- <code title="get /radar/datasets/{alias}">client.radar.datasets.<a href="./src/resources/radar/datasets.ts">get</a>(alias) -> string</code>

## DNS

### Top

Types:

- <code><a href="./src/resources/radar/dns/top.ts">TopAsesResponse</a></code>
- <code><a href="./src/resources/radar/dns/top.ts">TopLocationsResponse</a></code>

Methods:

- <code title="get /radar/dns/top/ases">client.radar.dns.top.<a href="./src/resources/radar/dns/top.ts">ases</a>({ ...params }) -> TopAsesResponse</code>
- <code title="get /radar/dns/top/locations">client.radar.dns.top.<a href="./src/resources/radar/dns/top.ts">locations</a>({ ...params }) -> TopLocationsResponse</code>

## Netflows

Types:

- <code><a href="./src/resources/radar/netflows/netflows.ts">NetflowTimeseriesResponse</a></code>

Methods:

- <code title="get /radar/netflows/timeseries">client.radar.netflows.<a href="./src/resources/radar/netflows/netflows.ts">timeseries</a>({ ...params }) -> NetflowTimeseriesResponse</code>

### Top

Types:

- <code><a href="./src/resources/radar/netflows/top.ts">TopAsesResponse</a></code>
- <code><a href="./src/resources/radar/netflows/top.ts">TopLocationsResponse</a></code>

Methods:

- <code title="get /radar/netflows/top/ases">client.radar.netflows.top.<a href="./src/resources/radar/netflows/top.ts">ases</a>({ ...params }) -> TopAsesResponse</code>
- <code title="get /radar/netflows/top/locations">client.radar.netflows.top.<a href="./src/resources/radar/netflows/top.ts">locations</a>({ ...params }) -> TopLocationsResponse</code>

## Search

Types:

- <code><a href="./src/resources/radar/search.ts">SearchGlobalResponse</a></code>

Methods:

- <code title="get /radar/search/global">client.radar.search.<a href="./src/resources/radar/search.ts">global</a>({ ...params }) -> SearchGlobalResponse</code>

## VerifiedBots

### Top

Types:

- <code><a href="./src/resources/radar/verified-bots/top.ts">TopBotsResponse</a></code>
- <code><a href="./src/resources/radar/verified-bots/top.ts">TopCategoriesResponse</a></code>

Methods:

- <code title="get /radar/verified_bots/top/bots">client.radar.verifiedBots.top.<a href="./src/resources/radar/verified-bots/top.ts">bots</a>({ ...params }) -> TopBotsResponse</code>
- <code title="get /radar/verified_bots/top/categories">client.radar.verifiedBots.top.<a href="./src/resources/radar/verified-bots/top.ts">categories</a>({ ...params }) -> TopCategoriesResponse</code>

## AS112

Types:

- <code><a href="./src/resources/radar/as112/as112.ts">AS112TimeseriesResponse</a></code>

Methods:

- <code title="get /radar/as112/timeseries">client.radar.as112.<a href="./src/resources/radar/as112/as112.ts">timeseries</a>({ ...params }) -> AS112TimeseriesResponse</code>

### Summary

Types:

- <code><a href="./src/resources/radar/as112/summary.ts">SummaryDNSSECResponse</a></code>
- <code><a href="./src/resources/radar/as112/summary.ts">SummaryEdnsResponse</a></code>
- <code><a href="./src/resources/radar/as112/summary.ts">SummaryIPVersionResponse</a></code>
- <code><a href="./src/resources/radar/as112/summary.ts">SummaryProtocolResponse</a></code>
- <code><a href="./src/resources/radar/as112/summary.ts">SummaryQueryTypeResponse</a></code>
- <code><a href="./src/resources/radar/as112/summary.ts">SummaryResponseCodesResponse</a></code>

Methods:

- <code title="get /radar/as112/summary/dnssec">client.radar.as112.summary.<a href="./src/resources/radar/as112/summary.ts">dnssec</a>({ ...params }) -> SummaryDNSSECResponse</code>
- <code title="get /radar/as112/summary/edns">client.radar.as112.summary.<a href="./src/resources/radar/as112/summary.ts">edns</a>({ ...params }) -> SummaryEdnsResponse</code>
- <code title="get /radar/as112/summary/ip_version">client.radar.as112.summary.<a href="./src/resources/radar/as112/summary.ts">ipVersion</a>({ ...params }) -> SummaryIPVersionResponse</code>
- <code title="get /radar/as112/summary/protocol">client.radar.as112.summary.<a href="./src/resources/radar/as112/summary.ts">protocol</a>({ ...params }) -> SummaryProtocolResponse</code>
- <code title="get /radar/as112/summary/query_type">client.radar.as112.summary.<a href="./src/resources/radar/as112/summary.ts">queryType</a>({ ...params }) -> SummaryQueryTypeResponse</code>
- <code title="get /radar/as112/summary/response_codes">client.radar.as112.summary.<a href="./src/resources/radar/as112/summary.ts">responseCodes</a>({ ...params }) -> SummaryResponseCodesResponse</code>

### TimeseriesGroups

Types:

- <code><a href="./src/resources/radar/as112/timeseries-groups.ts">TimeseriesGroupDNSSECResponse</a></code>
- <code><a href="./src/resources/radar/as112/timeseries-groups.ts">TimeseriesGroupEdnsResponse</a></code>
- <code><a href="./src/resources/radar/as112/timeseries-groups.ts">TimeseriesGroupIPVersionResponse</a></code>
- <code><a href="./src/resources/radar/as112/timeseries-groups.ts">TimeseriesGroupProtocolResponse</a></code>
- <code><a href="./src/resources/radar/as112/timeseries-groups.ts">TimeseriesGroupQueryTypeResponse</a></code>
- <code><a href="./src/resources/radar/as112/timeseries-groups.ts">TimeseriesGroupResponseCodesResponse</a></code>

Methods:

- <code title="get /radar/as112/timeseries_groups/dnssec">client.radar.as112.timeseriesGroups.<a href="./src/resources/radar/as112/timeseries-groups.ts">dnssec</a>({ ...params }) -> TimeseriesGroupDNSSECResponse</code>
- <code title="get /radar/as112/timeseries_groups/edns">client.radar.as112.timeseriesGroups.<a href="./src/resources/radar/as112/timeseries-groups.ts">edns</a>({ ...params }) -> TimeseriesGroupEdnsResponse</code>
- <code title="get /radar/as112/timeseries_groups/ip_version">client.radar.as112.timeseriesGroups.<a href="./src/resources/radar/as112/timeseries-groups.ts">ipVersion</a>({ ...params }) -> TimeseriesGroupIPVersionResponse</code>
- <code title="get /radar/as112/timeseries_groups/protocol">client.radar.as112.timeseriesGroups.<a href="./src/resources/radar/as112/timeseries-groups.ts">protocol</a>({ ...params }) -> TimeseriesGroupProtocolResponse</code>
- <code title="get /radar/as112/timeseries_groups/query_type">client.radar.as112.timeseriesGroups.<a href="./src/resources/radar/as112/timeseries-groups.ts">queryType</a>({ ...params }) -> TimeseriesGroupQueryTypeResponse</code>
- <code title="get /radar/as112/timeseries_groups/response_codes">client.radar.as112.timeseriesGroups.<a href="./src/resources/radar/as112/timeseries-groups.ts">responseCodes</a>({ ...params }) -> TimeseriesGroupResponseCodesResponse</code>

### Top

Types:

- <code><a href="./src/resources/radar/as112/top.ts">TopDNSSECResponse</a></code>
- <code><a href="./src/resources/radar/as112/top.ts">TopEdnsResponse</a></code>
- <code><a href="./src/resources/radar/as112/top.ts">TopIPVersionResponse</a></code>
- <code><a href="./src/resources/radar/as112/top.ts">TopLocationsResponse</a></code>

Methods:

- <code title="get /radar/as112/top/locations/dnssec/{dnssec}">client.radar.as112.top.<a href="./src/resources/radar/as112/top.ts">dnssec</a>(dnssec, { ...params }) -> TopDNSSECResponse</code>
- <code title="get /radar/as112/top/locations/edns/{edns}">client.radar.as112.top.<a href="./src/resources/radar/as112/top.ts">edns</a>(edns, { ...params }) -> TopEdnsResponse</code>
- <code title="get /radar/as112/top/locations/ip_version/{ip_version}">client.radar.as112.top.<a href="./src/resources/radar/as112/top.ts">ipVersion</a>(ipVersion, { ...params }) -> TopIPVersionResponse</code>
- <code title="get /radar/as112/top/locations">client.radar.as112.top.<a href="./src/resources/radar/as112/top.ts">locations</a>({ ...params }) -> TopLocationsResponse</code>

## Email

Types:

- <code><a href="./src/resources/radar/email/email.ts">RadarEmailSeries</a></code>
- <code><a href="./src/resources/radar/email/email.ts">RadarEmailSummary</a></code>

### Routing

#### Summary

Types:

- <code><a href="./src/resources/radar/email/routing/summary.ts">SummaryARCResponse</a></code>
- <code><a href="./src/resources/radar/email/routing/summary.ts">SummaryDKIMResponse</a></code>
- <code><a href="./src/resources/radar/email/routing/summary.ts">SummaryDMARCResponse</a></code>
- <code><a href="./src/resources/radar/email/routing/summary.ts">SummaryEncryptedResponse</a></code>
- <code><a href="./src/resources/radar/email/routing/summary.ts">SummaryIPVersionResponse</a></code>
- <code><a href="./src/resources/radar/email/routing/summary.ts">SummarySPFResponse</a></code>

Methods:

- <code title="get /radar/email/routing/summary/arc">client.radar.email.routing.summary.<a href="./src/resources/radar/email/routing/summary.ts">arc</a>({ ...params }) -> SummaryARCResponse</code>
- <code title="get /radar/email/routing/summary/dkim">client.radar.email.routing.summary.<a href="./src/resources/radar/email/routing/summary.ts">dkim</a>({ ...params }) -> SummaryDKIMResponse</code>
- <code title="get /radar/email/routing/summary/dmarc">client.radar.email.routing.summary.<a href="./src/resources/radar/email/routing/summary.ts">dmarc</a>({ ...params }) -> SummaryDMARCResponse</code>
- <code title="get /radar/email/routing/summary/encrypted">client.radar.email.routing.summary.<a href="./src/resources/radar/email/routing/summary.ts">encrypted</a>({ ...params }) -> SummaryEncryptedResponse</code>
- <code title="get /radar/email/routing/summary/ip_version">client.radar.email.routing.summary.<a href="./src/resources/radar/email/routing/summary.ts">ipVersion</a>({ ...params }) -> SummaryIPVersionResponse</code>
- <code title="get /radar/email/routing/summary/spf">client.radar.email.routing.summary.<a href="./src/resources/radar/email/routing/summary.ts">spf</a>({ ...params }) -> SummarySPFResponse</code>

#### TimeseriesGroups

Types:

- <code><a href="./src/resources/radar/email/routing/timeseries-groups.ts">TimeseriesGroupARCResponse</a></code>
- <code><a href="./src/resources/radar/email/routing/timeseries-groups.ts">TimeseriesGroupDKIMResponse</a></code>
- <code><a href="./src/resources/radar/email/routing/timeseries-groups.ts">TimeseriesGroupDMARCResponse</a></code>
- <code><a href="./src/resources/radar/email/routing/timeseries-groups.ts">TimeseriesGroupEncryptedResponse</a></code>
- <code><a href="./src/resources/radar/email/routing/timeseries-groups.ts">TimeseriesGroupIPVersionResponse</a></code>
- <code><a href="./src/resources/radar/email/routing/timeseries-groups.ts">TimeseriesGroupSPFResponse</a></code>

Methods:

- <code title="get /radar/email/routing/timeseries_groups/arc">client.radar.email.routing.timeseriesGroups.<a href="./src/resources/radar/email/routing/timeseries-groups.ts">arc</a>({ ...params }) -> TimeseriesGroupARCResponse</code>
- <code title="get /radar/email/routing/timeseries_groups/dkim">client.radar.email.routing.timeseriesGroups.<a href="./src/resources/radar/email/routing/timeseries-groups.ts">dkim</a>({ ...params }) -> TimeseriesGroupDKIMResponse</code>
- <code title="get /radar/email/routing/timeseries_groups/dmarc">client.radar.email.routing.timeseriesGroups.<a href="./src/resources/radar/email/routing/timeseries-groups.ts">dmarc</a>({ ...params }) -> TimeseriesGroupDMARCResponse</code>
- <code title="get /radar/email/routing/timeseries_groups/encrypted">client.radar.email.routing.timeseriesGroups.<a href="./src/resources/radar/email/routing/timeseries-groups.ts">encrypted</a>({ ...params }) -> TimeseriesGroupEncryptedResponse</code>
- <code title="get /radar/email/routing/timeseries_groups/ip_version">client.radar.email.routing.timeseriesGroups.<a href="./src/resources/radar/email/routing/timeseries-groups.ts">ipVersion</a>({ ...params }) -> TimeseriesGroupIPVersionResponse</code>
- <code title="get /radar/email/routing/timeseries_groups/spf">client.radar.email.routing.timeseriesGroups.<a href="./src/resources/radar/email/routing/timeseries-groups.ts">spf</a>({ ...params }) -> TimeseriesGroupSPFResponse</code>

### Security

#### Top

##### Tlds

Types:

- <code><a href="./src/resources/radar/email/security/top/tlds/tlds.ts">TldGetResponse</a></code>

Methods:

- <code title="get /radar/email/security/top/tlds">client.radar.email.security.top.tlds.<a href="./src/resources/radar/email/security/top/tlds/tlds.ts">get</a>({ ...params }) -> TldGetResponse</code>

###### Malicious

Types:

- <code><a href="./src/resources/radar/email/security/top/tlds/malicious.ts">MaliciousGetResponse</a></code>

Methods:

- <code title="get /radar/email/security/top/tlds/malicious/{malicious}">client.radar.email.security.top.tlds.malicious.<a href="./src/resources/radar/email/security/top/tlds/malicious.ts">get</a>(malicious, { ...params }) -> MaliciousGetResponse</code>

###### Spam

Types:

- <code><a href="./src/resources/radar/email/security/top/tlds/spam.ts">SpamGetResponse</a></code>

Methods:

- <code title="get /radar/email/security/top/tlds/spam/{spam}">client.radar.email.security.top.tlds.spam.<a href="./src/resources/radar/email/security/top/tlds/spam.ts">get</a>(spam, { ...params }) -> SpamGetResponse</code>

###### Spoof

Types:

- <code><a href="./src/resources/radar/email/security/top/tlds/spoof.ts">SpoofGetResponse</a></code>

Methods:

- <code title="get /radar/email/security/top/tlds/spoof/{spoof}">client.radar.email.security.top.tlds.spoof.<a href="./src/resources/radar/email/security/top/tlds/spoof.ts">get</a>(spoof, { ...params }) -> SpoofGetResponse</code>

#### Summary

Types:

- <code><a href="./src/resources/radar/email/security/summary.ts">SummaryARCResponse</a></code>
- <code><a href="./src/resources/radar/email/security/summary.ts">SummaryDKIMResponse</a></code>
- <code><a href="./src/resources/radar/email/security/summary.ts">SummaryDMARCResponse</a></code>
- <code><a href="./src/resources/radar/email/security/summary.ts">SummaryMaliciousResponse</a></code>
- <code><a href="./src/resources/radar/email/security/summary.ts">SummarySpamResponse</a></code>
- <code><a href="./src/resources/radar/email/security/summary.ts">SummarySPFResponse</a></code>
- <code><a href="./src/resources/radar/email/security/summary.ts">SummarySpoofResponse</a></code>
- <code><a href="./src/resources/radar/email/security/summary.ts">SummaryThreatCategoryResponse</a></code>
- <code><a href="./src/resources/radar/email/security/summary.ts">SummaryTLSVersionResponse</a></code>

Methods:

- <code title="get /radar/email/security/summary/arc">client.radar.email.security.summary.<a href="./src/resources/radar/email/security/summary.ts">arc</a>({ ...params }) -> SummaryARCResponse</code>
- <code title="get /radar/email/security/summary/dkim">client.radar.email.security.summary.<a href="./src/resources/radar/email/security/summary.ts">dkim</a>({ ...params }) -> SummaryDKIMResponse</code>
- <code title="get /radar/email/security/summary/dmarc">client.radar.email.security.summary.<a href="./src/resources/radar/email/security/summary.ts">dmarc</a>({ ...params }) -> SummaryDMARCResponse</code>
- <code title="get /radar/email/security/summary/malicious">client.radar.email.security.summary.<a href="./src/resources/radar/email/security/summary.ts">malicious</a>({ ...params }) -> SummaryMaliciousResponse</code>
- <code title="get /radar/email/security/summary/spam">client.radar.email.security.summary.<a href="./src/resources/radar/email/security/summary.ts">spam</a>({ ...params }) -> SummarySpamResponse</code>
- <code title="get /radar/email/security/summary/spf">client.radar.email.security.summary.<a href="./src/resources/radar/email/security/summary.ts">spf</a>({ ...params }) -> SummarySPFResponse</code>
- <code title="get /radar/email/security/summary/spoof">client.radar.email.security.summary.<a href="./src/resources/radar/email/security/summary.ts">spoof</a>({ ...params }) -> SummarySpoofResponse</code>
- <code title="get /radar/email/security/summary/threat_category">client.radar.email.security.summary.<a href="./src/resources/radar/email/security/summary.ts">threatCategory</a>({ ...params }) -> SummaryThreatCategoryResponse</code>
- <code title="get /radar/email/security/summary/tls_version">client.radar.email.security.summary.<a href="./src/resources/radar/email/security/summary.ts">tlsVersion</a>({ ...params }) -> SummaryTLSVersionResponse</code>

#### TimeseriesGroups

Types:

- <code><a href="./src/resources/radar/email/security/timeseries-groups.ts">TimeseriesGroupARCResponse</a></code>
- <code><a href="./src/resources/radar/email/security/timeseries-groups.ts">TimeseriesGroupDKIMResponse</a></code>
- <code><a href="./src/resources/radar/email/security/timeseries-groups.ts">TimeseriesGroupDMARCResponse</a></code>
- <code><a href="./src/resources/radar/email/security/timeseries-groups.ts">TimeseriesGroupMaliciousResponse</a></code>
- <code><a href="./src/resources/radar/email/security/timeseries-groups.ts">TimeseriesGroupSpamResponse</a></code>
- <code><a href="./src/resources/radar/email/security/timeseries-groups.ts">TimeseriesGroupSPFResponse</a></code>
- <code><a href="./src/resources/radar/email/security/timeseries-groups.ts">TimeseriesGroupSpoofResponse</a></code>
- <code><a href="./src/resources/radar/email/security/timeseries-groups.ts">TimeseriesGroupThreatCategoryResponse</a></code>
- <code><a href="./src/resources/radar/email/security/timeseries-groups.ts">TimeseriesGroupTLSVersionResponse</a></code>

Methods:

- <code title="get /radar/email/security/timeseries_groups/arc">client.radar.email.security.timeseriesGroups.<a href="./src/resources/radar/email/security/timeseries-groups.ts">arc</a>({ ...params }) -> TimeseriesGroupARCResponse</code>
- <code title="get /radar/email/security/timeseries_groups/dkim">client.radar.email.security.timeseriesGroups.<a href="./src/resources/radar/email/security/timeseries-groups.ts">dkim</a>({ ...params }) -> TimeseriesGroupDKIMResponse</code>
- <code title="get /radar/email/security/timeseries_groups/dmarc">client.radar.email.security.timeseriesGroups.<a href="./src/resources/radar/email/security/timeseries-groups.ts">dmarc</a>({ ...params }) -> TimeseriesGroupDMARCResponse</code>
- <code title="get /radar/email/security/timeseries_groups/malicious">client.radar.email.security.timeseriesGroups.<a href="./src/resources/radar/email/security/timeseries-groups.ts">malicious</a>({ ...params }) -> TimeseriesGroupMaliciousResponse</code>
- <code title="get /radar/email/security/timeseries_groups/spam">client.radar.email.security.timeseriesGroups.<a href="./src/resources/radar/email/security/timeseries-groups.ts">spam</a>({ ...params }) -> TimeseriesGroupSpamResponse</code>
- <code title="get /radar/email/security/timeseries_groups/spf">client.radar.email.security.timeseriesGroups.<a href="./src/resources/radar/email/security/timeseries-groups.ts">spf</a>({ ...params }) -> TimeseriesGroupSPFResponse</code>
- <code title="get /radar/email/security/timeseries_groups/spoof">client.radar.email.security.timeseriesGroups.<a href="./src/resources/radar/email/security/timeseries-groups.ts">spoof</a>({ ...params }) -> TimeseriesGroupSpoofResponse</code>
- <code title="get /radar/email/security/timeseries_groups/threat_category">client.radar.email.security.timeseriesGroups.<a href="./src/resources/radar/email/security/timeseries-groups.ts">threatCategory</a>({ ...params }) -> TimeseriesGroupThreatCategoryResponse</code>
- <code title="get /radar/email/security/timeseries_groups/tls_version">client.radar.email.security.timeseriesGroups.<a href="./src/resources/radar/email/security/timeseries-groups.ts">tlsVersion</a>({ ...params }) -> TimeseriesGroupTLSVersionResponse</code>

## Attacks

### Layer3

Types:

- <code><a href="./src/resources/radar/attacks/layer3/layer3.ts">Layer3TimeseriesResponse</a></code>

Methods:

- <code title="get /radar/attacks/layer3/timeseries">client.radar.attacks.layer3.<a href="./src/resources/radar/attacks/layer3/layer3.ts">timeseries</a>({ ...params }) -> Layer3TimeseriesResponse</code>

#### Summary

Types:

- <code><a href="./src/resources/radar/attacks/layer3/summary.ts">SummaryBitrateResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer3/summary.ts">SummaryDurationResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer3/summary.ts">SummaryGetResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer3/summary.ts">SummaryIPVersionResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer3/summary.ts">SummaryProtocolResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer3/summary.ts">SummaryVectorResponse</a></code>

Methods:

- <code title="get /radar/attacks/layer3/summary/bitrate">client.radar.attacks.layer3.summary.<a href="./src/resources/radar/attacks/layer3/summary.ts">bitrate</a>({ ...params }) -> SummaryBitrateResponse</code>
- <code title="get /radar/attacks/layer3/summary/duration">client.radar.attacks.layer3.summary.<a href="./src/resources/radar/attacks/layer3/summary.ts">duration</a>({ ...params }) -> SummaryDurationResponse</code>
- <code title="get /radar/attacks/layer3/summary">client.radar.attacks.layer3.summary.<a href="./src/resources/radar/attacks/layer3/summary.ts">get</a>({ ...params }) -> SummaryGetResponse</code>
- <code title="get /radar/attacks/layer3/summary/ip_version">client.radar.attacks.layer3.summary.<a href="./src/resources/radar/attacks/layer3/summary.ts">ipVersion</a>({ ...params }) -> SummaryIPVersionResponse</code>
- <code title="get /radar/attacks/layer3/summary/protocol">client.radar.attacks.layer3.summary.<a href="./src/resources/radar/attacks/layer3/summary.ts">protocol</a>({ ...params }) -> SummaryProtocolResponse</code>
- <code title="get /radar/attacks/layer3/summary/vector">client.radar.attacks.layer3.summary.<a href="./src/resources/radar/attacks/layer3/summary.ts">vector</a>({ ...params }) -> SummaryVectorResponse</code>

#### TimeseriesGroups

Types:

- <code><a href="./src/resources/radar/attacks/layer3/timeseries-groups.ts">TimeseriesGroupBitrateResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer3/timeseries-groups.ts">TimeseriesGroupDurationResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer3/timeseries-groups.ts">TimeseriesGroupGetResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer3/timeseries-groups.ts">TimeseriesGroupIndustryResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer3/timeseries-groups.ts">TimeseriesGroupIPVersionResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer3/timeseries-groups.ts">TimeseriesGroupProtocolResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer3/timeseries-groups.ts">TimeseriesGroupVectorResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer3/timeseries-groups.ts">TimeseriesGroupVerticalResponse</a></code>

Methods:

- <code title="get /radar/attacks/layer3/timeseries_groups/bitrate">client.radar.attacks.layer3.timeseriesGroups.<a href="./src/resources/radar/attacks/layer3/timeseries-groups.ts">bitrate</a>({ ...params }) -> TimeseriesGroupBitrateResponse</code>
- <code title="get /radar/attacks/layer3/timeseries_groups/duration">client.radar.attacks.layer3.timeseriesGroups.<a href="./src/resources/radar/attacks/layer3/timeseries-groups.ts">duration</a>({ ...params }) -> TimeseriesGroupDurationResponse</code>
- <code title="get /radar/attacks/layer3/timeseries_groups">client.radar.attacks.layer3.timeseriesGroups.<a href="./src/resources/radar/attacks/layer3/timeseries-groups.ts">get</a>({ ...params }) -> TimeseriesGroupGetResponse</code>
- <code title="get /radar/attacks/layer3/timeseries_groups/industry">client.radar.attacks.layer3.timeseriesGroups.<a href="./src/resources/radar/attacks/layer3/timeseries-groups.ts">industry</a>({ ...params }) -> TimeseriesGroupIndustryResponse</code>
- <code title="get /radar/attacks/layer3/timeseries_groups/ip_version">client.radar.attacks.layer3.timeseriesGroups.<a href="./src/resources/radar/attacks/layer3/timeseries-groups.ts">ipVersion</a>({ ...params }) -> TimeseriesGroupIPVersionResponse</code>
- <code title="get /radar/attacks/layer3/timeseries_groups/protocol">client.radar.attacks.layer3.timeseriesGroups.<a href="./src/resources/radar/attacks/layer3/timeseries-groups.ts">protocol</a>({ ...params }) -> TimeseriesGroupProtocolResponse</code>
- <code title="get /radar/attacks/layer3/timeseries_groups/vector">client.radar.attacks.layer3.timeseriesGroups.<a href="./src/resources/radar/attacks/layer3/timeseries-groups.ts">vector</a>({ ...params }) -> TimeseriesGroupVectorResponse</code>
- <code title="get /radar/attacks/layer3/timeseries_groups/vertical">client.radar.attacks.layer3.timeseriesGroups.<a href="./src/resources/radar/attacks/layer3/timeseries-groups.ts">vertical</a>({ ...params }) -> TimeseriesGroupVerticalResponse</code>

#### Top

Types:

- <code><a href="./src/resources/radar/attacks/layer3/top/top.ts">TopAttacksResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer3/top/top.ts">TopIndustryResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer3/top/top.ts">TopVerticalResponse</a></code>

Methods:

- <code title="get /radar/attacks/layer3/top/attacks">client.radar.attacks.layer3.top.<a href="./src/resources/radar/attacks/layer3/top/top.ts">attacks</a>({ ...params }) -> TopAttacksResponse</code>
- <code title="get /radar/attacks/layer3/top/industry">client.radar.attacks.layer3.top.<a href="./src/resources/radar/attacks/layer3/top/top.ts">industry</a>({ ...params }) -> TopIndustryResponse</code>
- <code title="get /radar/attacks/layer3/top/vertical">client.radar.attacks.layer3.top.<a href="./src/resources/radar/attacks/layer3/top/top.ts">vertical</a>({ ...params }) -> TopVerticalResponse</code>

##### Locations

Types:

- <code><a href="./src/resources/radar/attacks/layer3/top/locations.ts">LocationOriginResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer3/top/locations.ts">LocationTargetResponse</a></code>

Methods:

- <code title="get /radar/attacks/layer3/top/locations/origin">client.radar.attacks.layer3.top.locations.<a href="./src/resources/radar/attacks/layer3/top/locations.ts">origin</a>({ ...params }) -> LocationOriginResponse</code>
- <code title="get /radar/attacks/layer3/top/locations/target">client.radar.attacks.layer3.top.locations.<a href="./src/resources/radar/attacks/layer3/top/locations.ts">target</a>({ ...params }) -> LocationTargetResponse</code>

### Layer7

Types:

- <code><a href="./src/resources/radar/attacks/layer7/layer7.ts">Layer7TimeseriesResponse</a></code>

Methods:

- <code title="get /radar/attacks/layer7/timeseries">client.radar.attacks.layer7.<a href="./src/resources/radar/attacks/layer7/layer7.ts">timeseries</a>({ ...params }) -> Layer7TimeseriesResponse</code>

#### Summary

Types:

- <code><a href="./src/resources/radar/attacks/layer7/summary.ts">SummaryGetResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer7/summary.ts">SummaryHTTPMethodResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer7/summary.ts">SummaryHTTPVersionResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer7/summary.ts">SummaryIPVersionResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer7/summary.ts">SummaryManagedRulesResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer7/summary.ts">SummaryMitigationProductResponse</a></code>

Methods:

- <code title="get /radar/attacks/layer7/summary">client.radar.attacks.layer7.summary.<a href="./src/resources/radar/attacks/layer7/summary.ts">get</a>({ ...params }) -> SummaryGetResponse</code>
- <code title="get /radar/attacks/layer7/summary/http_method">client.radar.attacks.layer7.summary.<a href="./src/resources/radar/attacks/layer7/summary.ts">httpMethod</a>({ ...params }) -> SummaryHTTPMethodResponse</code>
- <code title="get /radar/attacks/layer7/summary/http_version">client.radar.attacks.layer7.summary.<a href="./src/resources/radar/attacks/layer7/summary.ts">httpVersion</a>({ ...params }) -> SummaryHTTPVersionResponse</code>
- <code title="get /radar/attacks/layer7/summary/ip_version">client.radar.attacks.layer7.summary.<a href="./src/resources/radar/attacks/layer7/summary.ts">ipVersion</a>({ ...params }) -> SummaryIPVersionResponse</code>
- <code title="get /radar/attacks/layer7/summary/managed_rules">client.radar.attacks.layer7.summary.<a href="./src/resources/radar/attacks/layer7/summary.ts">managedRules</a>({ ...params }) -> SummaryManagedRulesResponse</code>
- <code title="get /radar/attacks/layer7/summary/mitigation_product">client.radar.attacks.layer7.summary.<a href="./src/resources/radar/attacks/layer7/summary.ts">mitigationProduct</a>({ ...params }) -> SummaryMitigationProductResponse</code>

#### TimeseriesGroups

Types:

- <code><a href="./src/resources/radar/attacks/layer7/timeseries-groups.ts">TimeseriesGroupGetResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer7/timeseries-groups.ts">TimeseriesGroupHTTPMethodResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer7/timeseries-groups.ts">TimeseriesGroupHTTPVersionResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer7/timeseries-groups.ts">TimeseriesGroupIndustryResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer7/timeseries-groups.ts">TimeseriesGroupIPVersionResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer7/timeseries-groups.ts">TimeseriesGroupManagedRulesResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer7/timeseries-groups.ts">TimeseriesGroupMitigationProductResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer7/timeseries-groups.ts">TimeseriesGroupVerticalResponse</a></code>

Methods:

- <code title="get /radar/attacks/layer7/timeseries_groups">client.radar.attacks.layer7.timeseriesGroups.<a href="./src/resources/radar/attacks/layer7/timeseries-groups.ts">get</a>({ ...params }) -> TimeseriesGroupGetResponse</code>
- <code title="get /radar/attacks/layer7/timeseries_groups/http_method">client.radar.attacks.layer7.timeseriesGroups.<a href="./src/resources/radar/attacks/layer7/timeseries-groups.ts">httpMethod</a>({ ...params }) -> TimeseriesGroupHTTPMethodResponse</code>
- <code title="get /radar/attacks/layer7/timeseries_groups/http_version">client.radar.attacks.layer7.timeseriesGroups.<a href="./src/resources/radar/attacks/layer7/timeseries-groups.ts">httpVersion</a>({ ...params }) -> TimeseriesGroupHTTPVersionResponse</code>
- <code title="get /radar/attacks/layer7/timeseries_groups/industry">client.radar.attacks.layer7.timeseriesGroups.<a href="./src/resources/radar/attacks/layer7/timeseries-groups.ts">industry</a>({ ...params }) -> TimeseriesGroupIndustryResponse</code>
- <code title="get /radar/attacks/layer7/timeseries_groups/ip_version">client.radar.attacks.layer7.timeseriesGroups.<a href="./src/resources/radar/attacks/layer7/timeseries-groups.ts">ipVersion</a>({ ...params }) -> TimeseriesGroupIPVersionResponse</code>
- <code title="get /radar/attacks/layer7/timeseries_groups/managed_rules">client.radar.attacks.layer7.timeseriesGroups.<a href="./src/resources/radar/attacks/layer7/timeseries-groups.ts">managedRules</a>({ ...params }) -> TimeseriesGroupManagedRulesResponse</code>
- <code title="get /radar/attacks/layer7/timeseries_groups/mitigation_product">client.radar.attacks.layer7.timeseriesGroups.<a href="./src/resources/radar/attacks/layer7/timeseries-groups.ts">mitigationProduct</a>({ ...params }) -> TimeseriesGroupMitigationProductResponse</code>
- <code title="get /radar/attacks/layer7/timeseries_groups/vertical">client.radar.attacks.layer7.timeseriesGroups.<a href="./src/resources/radar/attacks/layer7/timeseries-groups.ts">vertical</a>({ ...params }) -> TimeseriesGroupVerticalResponse</code>

#### Top

Types:

- <code><a href="./src/resources/radar/attacks/layer7/top/top.ts">TopAttacksResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer7/top/top.ts">TopIndustryResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer7/top/top.ts">TopVerticalResponse</a></code>

Methods:

- <code title="get /radar/attacks/layer7/top/attacks">client.radar.attacks.layer7.top.<a href="./src/resources/radar/attacks/layer7/top/top.ts">attacks</a>({ ...params }) -> TopAttacksResponse</code>
- <code title="get /radar/attacks/layer7/top/industry">client.radar.attacks.layer7.top.<a href="./src/resources/radar/attacks/layer7/top/top.ts">industry</a>({ ...params }) -> TopIndustryResponse</code>
- <code title="get /radar/attacks/layer7/top/vertical">client.radar.attacks.layer7.top.<a href="./src/resources/radar/attacks/layer7/top/top.ts">vertical</a>({ ...params }) -> TopVerticalResponse</code>

##### Locations

Types:

- <code><a href="./src/resources/radar/attacks/layer7/top/locations.ts">LocationOriginResponse</a></code>
- <code><a href="./src/resources/radar/attacks/layer7/top/locations.ts">LocationTargetResponse</a></code>

Methods:

- <code title="get /radar/attacks/layer7/top/locations/origin">client.radar.attacks.layer7.top.locations.<a href="./src/resources/radar/attacks/layer7/top/locations.ts">origin</a>({ ...params }) -> LocationOriginResponse</code>
- <code title="get /radar/attacks/layer7/top/locations/target">client.radar.attacks.layer7.top.locations.<a href="./src/resources/radar/attacks/layer7/top/locations.ts">target</a>({ ...params }) -> LocationTargetResponse</code>

##### Ases

Types:

- <code><a href="./src/resources/radar/attacks/layer7/top/ases.ts">AseOriginResponse</a></code>

Methods:

- <code title="get /radar/attacks/layer7/top/ases/origin">client.radar.attacks.layer7.top.ases.<a href="./src/resources/radar/attacks/layer7/top/ases.ts">origin</a>({ ...params }) -> AseOriginResponse</code>

## Entities

Types:

- <code><a href="./src/resources/radar/entities/entities.ts">EntityGetResponse</a></code>

Methods:

- <code title="get /radar/entities/ip">client.radar.entities.<a href="./src/resources/radar/entities/entities.ts">get</a>({ ...params }) -> EntityGetResponse</code>

### ASNs

Types:

- <code><a href="./src/resources/radar/entities/asns.ts">ASNListResponse</a></code>
- <code><a href="./src/resources/radar/entities/asns.ts">ASNGetResponse</a></code>
- <code><a href="./src/resources/radar/entities/asns.ts">ASNIPResponse</a></code>
- <code><a href="./src/resources/radar/entities/asns.ts">ASNRelResponse</a></code>

Methods:

- <code title="get /radar/entities/asns">client.radar.entities.asns.<a href="./src/resources/radar/entities/asns.ts">list</a>({ ...params }) -> ASNListResponse</code>
- <code title="get /radar/entities/asns/{asn}">client.radar.entities.asns.<a href="./src/resources/radar/entities/asns.ts">get</a>(asn, { ...params }) -> ASNGetResponse</code>
- <code title="get /radar/entities/asns/ip">client.radar.entities.asns.<a href="./src/resources/radar/entities/asns.ts">ip</a>({ ...params }) -> ASNIPResponse</code>
- <code title="get /radar/entities/asns/{asn}/rel">client.radar.entities.asns.<a href="./src/resources/radar/entities/asns.ts">rel</a>(asn, { ...params }) -> ASNRelResponse</code>

### Locations

Types:

- <code><a href="./src/resources/radar/entities/locations.ts">LocationListResponse</a></code>
- <code><a href="./src/resources/radar/entities/locations.ts">LocationGetResponse</a></code>

Methods:

- <code title="get /radar/entities/locations">client.radar.entities.locations.<a href="./src/resources/radar/entities/locations.ts">list</a>({ ...params }) -> LocationListResponse</code>
- <code title="get /radar/entities/locations/{location}">client.radar.entities.locations.<a href="./src/resources/radar/entities/locations.ts">get</a>(location, { ...params }) -> LocationGetResponse</code>

## HTTP

Types:

- <code><a href="./src/resources/radar/http/http.ts">HTTPTimeseriesResponse</a></code>

Methods:

- <code title="get /radar/http/timeseries">client.radar.http.<a href="./src/resources/radar/http/http.ts">timeseries</a>({ ...params }) -> HTTPTimeseriesResponse</code>

### Top

Types:

- <code><a href="./src/resources/radar/http/top.ts">Browser</a></code>
- <code><a href="./src/resources/radar/http/top.ts">TopBrowserFamiliesResponse</a></code>
- <code><a href="./src/resources/radar/http/top.ts">TopBrowsersResponse</a></code>

Methods:

- <code title="get /radar/http/top/browser_families">client.radar.http.top.<a href="./src/resources/radar/http/top.ts">browserFamilies</a>({ ...params }) -> TopBrowserFamiliesResponse</code>
- <code title="get /radar/http/top/browsers">client.radar.http.top.<a href="./src/resources/radar/http/top.ts">browsers</a>({ ...params }) -> TopBrowsersResponse</code>

### Locations

Types:

- <code><a href="./src/resources/radar/http/locations/locations.ts">LocationGetResponse</a></code>

Methods:

- <code title="get /radar/http/top/locations">client.radar.http.locations.<a href="./src/resources/radar/http/locations/locations.ts">get</a>({ ...params }) -> LocationGetResponse</code>

#### BotClass

Types:

- <code><a href="./src/resources/radar/http/locations/bot-class.ts">BotClassGetResponse</a></code>

Methods:

- <code title="get /radar/http/top/locations/bot_class/{bot_class}">client.radar.http.locations.botClass.<a href="./src/resources/radar/http/locations/bot-class.ts">get</a>(botClass, { ...params }) -> BotClassGetResponse</code>

#### DeviceType

Types:

- <code><a href="./src/resources/radar/http/locations/device-type.ts">DeviceTypeGetResponse</a></code>

Methods:

- <code title="get /radar/http/top/locations/device_type/{device_type}">client.radar.http.locations.deviceType.<a href="./src/resources/radar/http/locations/device-type.ts">get</a>(deviceType, { ...params }) -> DeviceTypeGetResponse</code>

#### HTTPProtocol

Types:

- <code><a href="./src/resources/radar/http/locations/http-protocol.ts">HTTPProtocolGetResponse</a></code>

Methods:

- <code title="get /radar/http/top/locations/http_protocol/{http_protocol}">client.radar.http.locations.httpProtocol.<a href="./src/resources/radar/http/locations/http-protocol.ts">get</a>(httpProtocol, { ...params }) -> HTTPProtocolGetResponse</code>

#### HTTPMethod

Types:

- <code><a href="./src/resources/radar/http/locations/http-method.ts">HTTPMethodGetResponse</a></code>

Methods:

- <code title="get /radar/http/top/locations/http_version/{http_version}">client.radar.http.locations.httpMethod.<a href="./src/resources/radar/http/locations/http-method.ts">get</a>(httpVersion, { ...params }) -> HTTPMethodGetResponse</code>

#### IPVersion

Types:

- <code><a href="./src/resources/radar/http/locations/ip-version.ts">IPVersionGetResponse</a></code>

Methods:

- <code title="get /radar/http/top/locations/ip_version/{ip_version}">client.radar.http.locations.ipVersion.<a href="./src/resources/radar/http/locations/ip-version.ts">get</a>(ipVersion, { ...params }) -> IPVersionGetResponse</code>

#### OS

Types:

- <code><a href="./src/resources/radar/http/locations/os.ts">OSGetResponse</a></code>

Methods:

- <code title="get /radar/http/top/locations/os/{os}">client.radar.http.locations.os.<a href="./src/resources/radar/http/locations/os.ts">get</a>(os, { ...params }) -> OSGetResponse</code>

#### TLSVersion

Types:

- <code><a href="./src/resources/radar/http/locations/tls-version.ts">TLSVersionGetResponse</a></code>

Methods:

- <code title="get /radar/http/top/locations/tls_version/{tls_version}">client.radar.http.locations.tlsVersion.<a href="./src/resources/radar/http/locations/tls-version.ts">get</a>(tlsVersion, { ...params }) -> TLSVersionGetResponse</code>

#### BrowserFamily

Types:

- <code><a href="./src/resources/radar/http/locations/browser-family.ts">BrowserFamilyGetResponse</a></code>

Methods:

- <code title="get /radar/http/top/locations/browser_family/{browser_family}">client.radar.http.locations.browserFamily.<a href="./src/resources/radar/http/locations/browser-family.ts">get</a>(browserFamily, { ...params }) -> BrowserFamilyGetResponse</code>

### Ases

Types:

- <code><a href="./src/resources/radar/http/ases/ases.ts">AseGetResponse</a></code>

Methods:

- <code title="get /radar/http/top/ases">client.radar.http.ases.<a href="./src/resources/radar/http/ases/ases.ts">get</a>({ ...params }) -> AseGetResponse</code>

#### BotClass

Types:

- <code><a href="./src/resources/radar/http/ases/bot-class.ts">BotClassGetResponse</a></code>

Methods:

- <code title="get /radar/http/top/ases/bot_class/{bot_class}">client.radar.http.ases.botClass.<a href="./src/resources/radar/http/ases/bot-class.ts">get</a>(botClass, { ...params }) -> BotClassGetResponse</code>

#### DeviceType

Types:

- <code><a href="./src/resources/radar/http/ases/device-type.ts">DeviceTypeGetResponse</a></code>

Methods:

- <code title="get /radar/http/top/ases/device_type/{device_type}">client.radar.http.ases.deviceType.<a href="./src/resources/radar/http/ases/device-type.ts">get</a>(deviceType, { ...params }) -> DeviceTypeGetResponse</code>

#### HTTPProtocol

Types:

- <code><a href="./src/resources/radar/http/ases/http-protocol.ts">HTTPProtocolGetResponse</a></code>

Methods:

- <code title="get /radar/http/top/ases/http_protocol/{http_protocol}">client.radar.http.ases.httpProtocol.<a href="./src/resources/radar/http/ases/http-protocol.ts">get</a>(httpProtocol, { ...params }) -> HTTPProtocolGetResponse</code>

#### HTTPMethod

Types:

- <code><a href="./src/resources/radar/http/ases/http-method.ts">HTTPMethodGetResponse</a></code>

Methods:

- <code title="get /radar/http/top/ases/http_version/{http_version}">client.radar.http.ases.httpMethod.<a href="./src/resources/radar/http/ases/http-method.ts">get</a>(httpVersion, { ...params }) -> HTTPMethodGetResponse</code>

#### IPVersion

Types:

- <code><a href="./src/resources/radar/http/ases/ip-version.ts">IPVersionGetResponse</a></code>

Methods:

- <code title="get /radar/http/top/ases/ip_version/{ip_version}">client.radar.http.ases.ipVersion.<a href="./src/resources/radar/http/ases/ip-version.ts">get</a>(ipVersion, { ...params }) -> IPVersionGetResponse</code>

#### OS

Types:

- <code><a href="./src/resources/radar/http/ases/os.ts">OSGetResponse</a></code>

Methods:

- <code title="get /radar/http/top/ases/os/{os}">client.radar.http.ases.os.<a href="./src/resources/radar/http/ases/os.ts">get</a>(os, { ...params }) -> OSGetResponse</code>

#### TLSVersion

Types:

- <code><a href="./src/resources/radar/http/ases/tls-version.ts">TLSVersionGetResponse</a></code>

Methods:

- <code title="get /radar/http/top/ases/tls_version/{tls_version}">client.radar.http.ases.tlsVersion.<a href="./src/resources/radar/http/ases/tls-version.ts">get</a>(tlsVersion, { ...params }) -> TLSVersionGetResponse</code>

#### BrowserFamily

Types:

- <code><a href="./src/resources/radar/http/ases/browser-family.ts">BrowserFamilyGetResponse</a></code>

Methods:

- <code title="get /radar/http/top/ases/browser_family/{browser_family}">client.radar.http.ases.browserFamily.<a href="./src/resources/radar/http/ases/browser-family.ts">get</a>(browserFamily, { ...params }) -> BrowserFamilyGetResponse</code>

### Summary

Types:

- <code><a href="./src/resources/radar/http/summary.ts">SummaryBotClassResponse</a></code>
- <code><a href="./src/resources/radar/http/summary.ts">SummaryDeviceTypeResponse</a></code>
- <code><a href="./src/resources/radar/http/summary.ts">SummaryHTTPProtocolResponse</a></code>
- <code><a href="./src/resources/radar/http/summary.ts">SummaryHTTPVersionResponse</a></code>
- <code><a href="./src/resources/radar/http/summary.ts">SummaryIPVersionResponse</a></code>
- <code><a href="./src/resources/radar/http/summary.ts">SummaryOSResponse</a></code>
- <code><a href="./src/resources/radar/http/summary.ts">SummaryPostQuantumResponse</a></code>
- <code><a href="./src/resources/radar/http/summary.ts">SummaryTLSVersionResponse</a></code>

Methods:

- <code title="get /radar/http/summary/bot_class">client.radar.http.summary.<a href="./src/resources/radar/http/summary.ts">botClass</a>({ ...params }) -> SummaryBotClassResponse</code>
- <code title="get /radar/http/summary/device_type">client.radar.http.summary.<a href="./src/resources/radar/http/summary.ts">deviceType</a>({ ...params }) -> SummaryDeviceTypeResponse</code>
- <code title="get /radar/http/summary/http_protocol">client.radar.http.summary.<a href="./src/resources/radar/http/summary.ts">httpProtocol</a>({ ...params }) -> SummaryHTTPProtocolResponse</code>
- <code title="get /radar/http/summary/http_version">client.radar.http.summary.<a href="./src/resources/radar/http/summary.ts">httpVersion</a>({ ...params }) -> SummaryHTTPVersionResponse</code>
- <code title="get /radar/http/summary/ip_version">client.radar.http.summary.<a href="./src/resources/radar/http/summary.ts">ipVersion</a>({ ...params }) -> SummaryIPVersionResponse</code>
- <code title="get /radar/http/summary/os">client.radar.http.summary.<a href="./src/resources/radar/http/summary.ts">os</a>({ ...params }) -> SummaryOSResponse</code>
- <code title="get /radar/http/summary/post_quantum">client.radar.http.summary.<a href="./src/resources/radar/http/summary.ts">postQuantum</a>({ ...params }) -> SummaryPostQuantumResponse</code>
- <code title="get /radar/http/summary/tls_version">client.radar.http.summary.<a href="./src/resources/radar/http/summary.ts">tlsVersion</a>({ ...params }) -> SummaryTLSVersionResponse</code>

### TimeseriesGroups

Types:

- <code><a href="./src/resources/radar/http/timeseries-groups.ts">TimeseriesGroupBotClassResponse</a></code>
- <code><a href="./src/resources/radar/http/timeseries-groups.ts">TimeseriesGroupBrowserResponse</a></code>
- <code><a href="./src/resources/radar/http/timeseries-groups.ts">TimeseriesGroupBrowserFamilyResponse</a></code>
- <code><a href="./src/resources/radar/http/timeseries-groups.ts">TimeseriesGroupDeviceTypeResponse</a></code>
- <code><a href="./src/resources/radar/http/timeseries-groups.ts">TimeseriesGroupHTTPProtocolResponse</a></code>
- <code><a href="./src/resources/radar/http/timeseries-groups.ts">TimeseriesGroupHTTPVersionResponse</a></code>
- <code><a href="./src/resources/radar/http/timeseries-groups.ts">TimeseriesGroupIPVersionResponse</a></code>
- <code><a href="./src/resources/radar/http/timeseries-groups.ts">TimeseriesGroupOSResponse</a></code>
- <code><a href="./src/resources/radar/http/timeseries-groups.ts">TimeseriesGroupPostQuantumResponse</a></code>
- <code><a href="./src/resources/radar/http/timeseries-groups.ts">TimeseriesGroupTLSVersionResponse</a></code>

Methods:

- <code title="get /radar/http/timeseries_groups/bot_class">client.radar.http.timeseriesGroups.<a href="./src/resources/radar/http/timeseries-groups.ts">botClass</a>({ ...params }) -> TimeseriesGroupBotClassResponse</code>
- <code title="get /radar/http/timeseries_groups/browser">client.radar.http.timeseriesGroups.<a href="./src/resources/radar/http/timeseries-groups.ts">browser</a>({ ...params }) -> TimeseriesGroupBrowserResponse</code>
- <code title="get /radar/http/timeseries_groups/browser_family">client.radar.http.timeseriesGroups.<a href="./src/resources/radar/http/timeseries-groups.ts">browserFamily</a>({ ...params }) -> TimeseriesGroupBrowserFamilyResponse</code>
- <code title="get /radar/http/timeseries_groups/device_type">client.radar.http.timeseriesGroups.<a href="./src/resources/radar/http/timeseries-groups.ts">deviceType</a>({ ...params }) -> TimeseriesGroupDeviceTypeResponse</code>
- <code title="get /radar/http/timeseries_groups/http_protocol">client.radar.http.timeseriesGroups.<a href="./src/resources/radar/http/timeseries-groups.ts">httpProtocol</a>({ ...params }) -> TimeseriesGroupHTTPProtocolResponse</code>
- <code title="get /radar/http/timeseries_groups/http_version">client.radar.http.timeseriesGroups.<a href="./src/resources/radar/http/timeseries-groups.ts">httpVersion</a>({ ...params }) -> TimeseriesGroupHTTPVersionResponse</code>
- <code title="get /radar/http/timeseries_groups/ip_version">client.radar.http.timeseriesGroups.<a href="./src/resources/radar/http/timeseries-groups.ts">ipVersion</a>({ ...params }) -> TimeseriesGroupIPVersionResponse</code>
- <code title="get /radar/http/timeseries_groups/os">client.radar.http.timeseriesGroups.<a href="./src/resources/radar/http/timeseries-groups.ts">os</a>({ ...params }) -> TimeseriesGroupOSResponse</code>
- <code title="get /radar/http/timeseries_groups/post_quantum">client.radar.http.timeseriesGroups.<a href="./src/resources/radar/http/timeseries-groups.ts">postQuantum</a>({ ...params }) -> TimeseriesGroupPostQuantumResponse</code>
- <code title="get /radar/http/timeseries_groups/tls_version">client.radar.http.timeseriesGroups.<a href="./src/resources/radar/http/timeseries-groups.ts">tlsVersion</a>({ ...params }) -> TimeseriesGroupTLSVersionResponse</code>

## Quality

### IQI

Types:

- <code><a href="./src/resources/radar/quality/iqi.ts">IQISummaryResponse</a></code>
- <code><a href="./src/resources/radar/quality/iqi.ts">IQITimeseriesGroupsResponse</a></code>

Methods:

- <code title="get /radar/quality/iqi/summary">client.radar.quality.iqi.<a href="./src/resources/radar/quality/iqi.ts">summary</a>({ ...params }) -> IQISummaryResponse</code>
- <code title="get /radar/quality/iqi/timeseries_groups">client.radar.quality.iqi.<a href="./src/resources/radar/quality/iqi.ts">timeseriesGroups</a>({ ...params }) -> IQITimeseriesGroupsResponse</code>

### Speed

Types:

- <code><a href="./src/resources/radar/quality/speed/speed.ts">SpeedHistogramResponse</a></code>
- <code><a href="./src/resources/radar/quality/speed/speed.ts">SpeedSummaryResponse</a></code>

Methods:

- <code title="get /radar/quality/speed/histogram">client.radar.quality.speed.<a href="./src/resources/radar/quality/speed/speed.ts">histogram</a>({ ...params }) -> SpeedHistogramResponse</code>
- <code title="get /radar/quality/speed/summary">client.radar.quality.speed.<a href="./src/resources/radar/quality/speed/speed.ts">summary</a>({ ...params }) -> SpeedSummaryResponse</code>

#### Top

Types:

- <code><a href="./src/resources/radar/quality/speed/top.ts">TopAsesResponse</a></code>
- <code><a href="./src/resources/radar/quality/speed/top.ts">TopLocationsResponse</a></code>

Methods:

- <code title="get /radar/quality/speed/top/ases">client.radar.quality.speed.top.<a href="./src/resources/radar/quality/speed/top.ts">ases</a>({ ...params }) -> TopAsesResponse</code>
- <code title="get /radar/quality/speed/top/locations">client.radar.quality.speed.top.<a href="./src/resources/radar/quality/speed/top.ts">locations</a>({ ...params }) -> TopLocationsResponse</code>

## Ranking

Types:

- <code><a href="./src/resources/radar/ranking/ranking.ts">RankingTimeseriesGroupsResponse</a></code>
- <code><a href="./src/resources/radar/ranking/ranking.ts">RankingTopResponse</a></code>

Methods:

- <code title="get /radar/ranking/timeseries_groups">client.radar.ranking.<a href="./src/resources/radar/ranking/ranking.ts">timeseriesGroups</a>({ ...params }) -> RankingTimeseriesGroupsResponse</code>
- <code title="get /radar/ranking/top">client.radar.ranking.<a href="./src/resources/radar/ranking/ranking.ts">top</a>({ ...params }) -> RankingTopResponse</code>

### Domain

Types:

- <code><a href="./src/resources/radar/ranking/domain.ts">DomainGetResponse</a></code>

Methods:

- <code title="get /radar/ranking/domain/{domain}">client.radar.ranking.domain.<a href="./src/resources/radar/ranking/domain.ts">get</a>(domain, { ...params }) -> DomainGetResponse</code>

## TrafficAnomalies

Types:

- <code><a href="./src/resources/radar/traffic-anomalies/traffic-anomalies.ts">TrafficAnomalyGetResponse</a></code>

Methods:

- <code title="get /radar/traffic_anomalies">client.radar.trafficAnomalies.<a href="./src/resources/radar/traffic-anomalies/traffic-anomalies.ts">get</a>({ ...params }) -> TrafficAnomalyGetResponse</code>

### Locations

Types:

- <code><a href="./src/resources/radar/traffic-anomalies/locations.ts">LocationGetResponse</a></code>

Methods:

- <code title="get /radar/traffic_anomalies/locations">client.radar.trafficAnomalies.locations.<a href="./src/resources/radar/traffic-anomalies/locations.ts">get</a>({ ...params }) -> LocationGetResponse</code>

## TCPResetsTimeouts

Types:

- <code><a href="./src/resources/radar/tcp-resets-timeouts.ts">TCPResetsTimeoutSummaryResponse</a></code>
- <code><a href="./src/resources/radar/tcp-resets-timeouts.ts">TCPResetsTimeoutTimeseriesGroupsResponse</a></code>

Methods:

- <code title="get /radar/tcp_resets_timeouts/summary">client.radar.tcpResetsTimeouts.<a href="./src/resources/radar/tcp-resets-timeouts.ts">summary</a>({ ...params }) -> TCPResetsTimeoutSummaryResponse</code>
- <code title="get /radar/tcp_resets_timeouts/timeseries_groups">client.radar.tcpResetsTimeouts.<a href="./src/resources/radar/tcp-resets-timeouts.ts">timeseriesGroups</a>({ ...params }) -> TCPResetsTimeoutTimeseriesGroupsResponse</code>

# BotManagement

Types:

- <code><a href="./src/resources/bot-management.ts">BotFightModeConfiguration</a></code>
- <code><a href="./src/resources/bot-management.ts">SubscriptionConfiguration</a></code>
- <code><a href="./src/resources/bot-management.ts">SuperBotFightModeDefinitelyConfiguration</a></code>
- <code><a href="./src/resources/bot-management.ts">SuperBotFightModeLikelyConfiguration</a></code>
- <code><a href="./src/resources/bot-management.ts">BotManagementUpdateResponse</a></code>
- <code><a href="./src/resources/bot-management.ts">BotManagementGetResponse</a></code>

Methods:

- <code title="put /zones/{zone_id}/bot_management">client.botManagement.<a href="./src/resources/bot-management.ts">update</a>({ ...params }) -> BotManagementUpdateResponse</code>
- <code title="get /zones/{zone_id}/bot_management">client.botManagement.<a href="./src/resources/bot-management.ts">get</a>({ ...params }) -> BotManagementGetResponse</code>

# OriginPostQuantumEncryption

Types:

- <code><a href="./src/resources/origin-post-quantum-encryption.ts">OriginPostQuantumEncryptionUpdateResponse</a></code>
- <code><a href="./src/resources/origin-post-quantum-encryption.ts">OriginPostQuantumEncryptionGetResponse</a></code>

Methods:

- <code title="put /zones/{zone_id}/cache/origin_post_quantum_encryption">client.originPostQuantumEncryption.<a href="./src/resources/origin-post-quantum-encryption.ts">update</a>({ ...params }) -> OriginPostQuantumEncryptionUpdateResponse</code>
- <code title="get /zones/{zone_id}/cache/origin_post_quantum_encryption">client.originPostQuantumEncryption.<a href="./src/resources/origin-post-quantum-encryption.ts">get</a>({ ...params }) -> OriginPostQuantumEncryptionGetResponse</code>

# Speed

Types:

- <code><a href="./src/resources/speed/speed.ts">LabeledRegion</a></code>
- <code><a href="./src/resources/speed/speed.ts">LighthouseReport</a></code>
- <code><a href="./src/resources/speed/speed.ts">Trend</a></code>

## Schedule

Types:

- <code><a href="./src/resources/speed/schedule.ts">Schedule</a></code>
- <code><a href="./src/resources/speed/schedule.ts">ScheduleCreateResponse</a></code>
- <code><a href="./src/resources/speed/schedule.ts">ScheduleDeleteResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/speed_api/schedule/{url}">client.speed.schedule.<a href="./src/resources/speed/schedule.ts">create</a>(url, { ...params }) -> ScheduleCreateResponse</code>
- <code title="delete /zones/{zone_id}/speed_api/schedule/{url}">client.speed.schedule.<a href="./src/resources/speed/schedule.ts">delete</a>(url, { ...params }) -> ScheduleDeleteResponse</code>
- <code title="get /zones/{zone_id}/speed_api/schedule/{url}">client.speed.schedule.<a href="./src/resources/speed/schedule.ts">get</a>(url, { ...params }) -> Schedule</code>

## Availabilities

Types:

- <code><a href="./src/resources/speed/availabilities.ts">Availability</a></code>

Methods:

- <code title="get /zones/{zone_id}/speed_api/availabilities">client.speed.availabilities.<a href="./src/resources/speed/availabilities.ts">list</a>({ ...params }) -> Availability</code>

## Pages

Types:

- <code><a href="./src/resources/speed/pages/pages.ts">PageListResponse</a></code>

Methods:

- <code title="get /zones/{zone_id}/speed_api/pages">client.speed.pages.<a href="./src/resources/speed/pages/pages.ts">list</a>({ ...params }) -> PageListResponsesSinglePage</code>
- <code title="get /zones/{zone_id}/speed_api/pages/{url}/trend">client.speed.pages.<a href="./src/resources/speed/pages/pages.ts">trend</a>(url, { ...params }) -> Trend</code>

### Tests

Types:

- <code><a href="./src/resources/speed/pages/tests.ts">Test</a></code>
- <code><a href="./src/resources/speed/pages/tests.ts">TestListResponse</a></code>
- <code><a href="./src/resources/speed/pages/tests.ts">TestDeleteResponse</a></code>

Methods:

- <code title="post /zones/{zone_id}/speed_api/pages/{url}/tests">client.speed.pages.tests.<a href="./src/resources/speed/pages/tests.ts">create</a>(url, { ...params }) -> Test</code>
- <code title="get /zones/{zone_id}/speed_api/pages/{url}/tests">client.speed.pages.tests.<a href="./src/resources/speed/pages/tests.ts">list</a>(url, { ...params }) -> TestListResponse</code>
- <code title="delete /zones/{zone_id}/speed_api/pages/{url}/tests">client.speed.pages.tests.<a href="./src/resources/speed/pages/tests.ts">delete</a>(url, { ...params }) -> TestDeleteResponse</code>
- <code title="get /zones/{zone_id}/speed_api/pages/{url}/tests/{test_id}">client.speed.pages.tests.<a href="./src/resources/speed/pages/tests.ts">get</a>(url, testId, { ...params }) -> Test</code>

# DCVDelegation

Types:

- <code><a href="./src/resources/dcv-delegation.ts">DCVDelegationUUID</a></code>

Methods:

- <code title="get /zones/{zone_id}/dcv_delegation/uuid">client.dcvDelegation.<a href="./src/resources/dcv-delegation.ts">get</a>({ ...params }) -> DCVDelegationUUID</code>

# Hostnames

## Settings

### TLS

Types:

- <code><a href="./src/resources/hostnames/settings/tls.ts">Setting</a></code>
- <code><a href="./src/resources/hostnames/settings/tls.ts">SettingValue</a></code>
- <code><a href="./src/resources/hostnames/settings/tls.ts">TLSDeleteResponse</a></code>
- <code><a href="./src/resources/hostnames/settings/tls.ts">TLSGetResponse</a></code>

Methods:

- <code title="put /zones/{zone_id}/hostnames/settings/{setting_id}/{hostname}">client.hostnames.settings.tls.<a href="./src/resources/hostnames/settings/tls.ts">update</a>(settingId, hostname, { ...params }) -> Setting</code>
- <code title="delete /zones/{zone_id}/hostnames/settings/{setting_id}/{hostname}">client.hostnames.settings.tls.<a href="./src/resources/hostnames/settings/tls.ts">delete</a>(settingId, hostname, { ...params }) -> TLSDeleteResponse</code>
- <code title="get /zones/{zone_id}/hostnames/settings/{setting_id}">client.hostnames.settings.tls.<a href="./src/resources/hostnames/settings/tls.ts">get</a>(settingId, { ...params }) -> TLSGetResponse | null</code>

# Snippets

Types:

- <code><a href="./src/resources/snippets/snippets.ts">Snippet</a></code>
- <code><a href="./src/resources/snippets/snippets.ts">SnippetDeleteResponse</a></code>

Methods:

- <code title="put /zones/{zone_id}/snippets/{snippet_name}">client.snippets.<a href="./src/resources/snippets/snippets.ts">update</a>(snippetName, { ...params }) -> Snippet</code>
- <code title="get /zones/{zone_id}/snippets">client.snippets.<a href="./src/resources/snippets/snippets.ts">list</a>({ ...params }) -> SnippetsSinglePage</code>
- <code title="delete /zones/{zone_id}/snippets/{snippet_name}">client.snippets.<a href="./src/resources/snippets/snippets.ts">delete</a>(snippetName, { ...params }) -> SnippetDeleteResponse</code>
- <code title="get /zones/{zone_id}/snippets/{snippet_name}">client.snippets.<a href="./src/resources/snippets/snippets.ts">get</a>(snippetName, { ...params }) -> Snippet</code>

## Content

Methods:

- <code title="get /zones/{zone_id}/snippets/{snippet_name}/content">client.snippets.content.<a href="./src/resources/snippets/content.ts">get</a>(snippetName, { ...params }) -> Response</code>

## Rules

Types:

- <code><a href="./src/resources/snippets/rules.ts">RuleUpdateResponse</a></code>
- <code><a href="./src/resources/snippets/rules.ts">RuleListResponse</a></code>

Methods:

- <code title="put /zones/{zone_id}/snippets/snippet_rules">client.snippets.rules.<a href="./src/resources/snippets/rules.ts">update</a>({ ...params }) -> RuleUpdateResponse</code>
- <code title="get /zones/{zone_id}/snippets/snippet_rules">client.snippets.rules.<a href="./src/resources/snippets/rules.ts">list</a>({ ...params }) -> RuleListResponsesSinglePage</code>

# Calls

Types:

- <code><a href="./src/resources/calls/calls.ts">CallsApp</a></code>
- <code><a href="./src/resources/calls/calls.ts">CallsAppWithSecret</a></code>
- <code><a href="./src/resources/calls/calls.ts">CallListResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/calls/apps">client.calls.<a href="./src/resources/calls/calls.ts">create</a>({ ...params }) -> CallsAppWithSecret</code>
- <code title="put /accounts/{account_id}/calls/apps/{app_id}">client.calls.<a href="./src/resources/calls/calls.ts">update</a>(appId, { ...params }) -> CallsApp</code>
- <code title="get /accounts/{account_id}/calls/apps">client.calls.<a href="./src/resources/calls/calls.ts">list</a>({ ...params }) -> CallListResponsesSinglePage</code>
- <code title="delete /accounts/{account_id}/calls/apps/{app_id}">client.calls.<a href="./src/resources/calls/calls.ts">delete</a>(appId, { ...params }) -> CallsApp</code>
- <code title="get /accounts/{account_id}/calls/apps/{app_id}">client.calls.<a href="./src/resources/calls/calls.ts">get</a>(appId, { ...params }) -> CallsApp</code>

## TURN

### Keys

Types:

- <code><a href="./src/resources/calls/turn/keys.ts">KeyCreateResponse</a></code>
- <code><a href="./src/resources/calls/turn/keys.ts">KeyUpdateResponse</a></code>
- <code><a href="./src/resources/calls/turn/keys.ts">KeyListResponse</a></code>
- <code><a href="./src/resources/calls/turn/keys.ts">KeyDeleteResponse</a></code>
- <code><a href="./src/resources/calls/turn/keys.ts">KeyGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/calls/turn_keys">client.calls.turn.keys.<a href="./src/resources/calls/turn/keys.ts">create</a>({ ...params }) -> KeyCreateResponse</code>
- <code title="put /accounts/{account_id}/calls/turn_keys/{key_id}">client.calls.turn.keys.<a href="./src/resources/calls/turn/keys.ts">update</a>(keyId, { ...params }) -> KeyUpdateResponse</code>
- <code title="get /accounts/{account_id}/calls/turn_keys">client.calls.turn.keys.<a href="./src/resources/calls/turn/keys.ts">list</a>({ ...params }) -> KeyListResponsesSinglePage</code>
- <code title="delete /accounts/{account_id}/calls/turn_keys/{key_id}">client.calls.turn.keys.<a href="./src/resources/calls/turn/keys.ts">delete</a>(keyId, { ...params }) -> KeyDeleteResponse</code>
- <code title="get /accounts/{account_id}/calls/turn_keys/{key_id}">client.calls.turn.keys.<a href="./src/resources/calls/turn/keys.ts">get</a>(keyId, { ...params }) -> KeyGetResponse</code>

# CloudforceOne

## Requests

Types:

- <code><a href="./src/resources/cloudforce-one/requests/requests.ts">Item</a></code>
- <code><a href="./src/resources/cloudforce-one/requests/requests.ts">ListItem</a></code>
- <code><a href="./src/resources/cloudforce-one/requests/requests.ts">Quota</a></code>
- <code><a href="./src/resources/cloudforce-one/requests/requests.ts">RequestConstants</a></code>
- <code><a href="./src/resources/cloudforce-one/requests/requests.ts">RequestTypes</a></code>
- <code><a href="./src/resources/cloudforce-one/requests/requests.ts">RequestDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_identifier}/cloudforce-one/requests/new">client.cloudforceOne.requests.<a href="./src/resources/cloudforce-one/requests/requests.ts">create</a>(accountIdentifier, { ...params }) -> Item</code>
- <code title="put /accounts/{account_identifier}/cloudforce-one/requests/{request_identifier}">client.cloudforceOne.requests.<a href="./src/resources/cloudforce-one/requests/requests.ts">update</a>(accountIdentifier, requestIdentifier, { ...params }) -> Item</code>
- <code title="post /accounts/{account_identifier}/cloudforce-one/requests">client.cloudforceOne.requests.<a href="./src/resources/cloudforce-one/requests/requests.ts">list</a>(accountIdentifier, { ...params }) -> ListItemsV4PagePaginationArray</code>
- <code title="delete /accounts/{account_identifier}/cloudforce-one/requests/{request_identifier}">client.cloudforceOne.requests.<a href="./src/resources/cloudforce-one/requests/requests.ts">delete</a>(accountIdentifier, requestIdentifier) -> RequestDeleteResponse</code>
- <code title="get /accounts/{account_identifier}/cloudforce-one/requests/constants">client.cloudforceOne.requests.<a href="./src/resources/cloudforce-one/requests/requests.ts">constants</a>(accountIdentifier) -> RequestConstants</code>
- <code title="get /accounts/{account_identifier}/cloudforce-one/requests/{request_identifier}">client.cloudforceOne.requests.<a href="./src/resources/cloudforce-one/requests/requests.ts">get</a>(accountIdentifier, requestIdentifier) -> Item</code>
- <code title="get /accounts/{account_identifier}/cloudforce-one/requests/quota">client.cloudforceOne.requests.<a href="./src/resources/cloudforce-one/requests/requests.ts">quota</a>(accountIdentifier) -> Quota</code>
- <code title="get /accounts/{account_identifier}/cloudforce-one/requests/types">client.cloudforceOne.requests.<a href="./src/resources/cloudforce-one/requests/requests.ts">types</a>(accountIdentifier) -> RequestTypes</code>

### Message

Types:

- <code><a href="./src/resources/cloudforce-one/requests/message.ts">Message</a></code>
- <code><a href="./src/resources/cloudforce-one/requests/message.ts">MessageDeleteResponse</a></code>
- <code><a href="./src/resources/cloudforce-one/requests/message.ts">MessageGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_identifier}/cloudforce-one/requests/{request_identifier}/message/new">client.cloudforceOne.requests.message.<a href="./src/resources/cloudforce-one/requests/message.ts">create</a>(accountIdentifier, requestIdentifier, { ...params }) -> Message</code>
- <code title="put /accounts/{account_identifier}/cloudforce-one/requests/{request_identifier}/message/{message_identifer}">client.cloudforceOne.requests.message.<a href="./src/resources/cloudforce-one/requests/message.ts">update</a>(accountIdentifier, requestIdentifier, messageIdentifer, { ...params }) -> Message</code>
- <code title="delete /accounts/{account_identifier}/cloudforce-one/requests/{request_identifier}/message/{message_identifer}">client.cloudforceOne.requests.message.<a href="./src/resources/cloudforce-one/requests/message.ts">delete</a>(accountIdentifier, requestIdentifier, messageIdentifer) -> MessageDeleteResponse</code>
- <code title="post /accounts/{account_identifier}/cloudforce-one/requests/{request_identifier}/message">client.cloudforceOne.requests.message.<a href="./src/resources/cloudforce-one/requests/message.ts">get</a>(accountIdentifier, requestIdentifier, { ...params }) -> MessageGetResponse</code>

### Priority

Types:

- <code><a href="./src/resources/cloudforce-one/requests/priority.ts">Label</a></code>
- <code><a href="./src/resources/cloudforce-one/requests/priority.ts">Priority</a></code>
- <code><a href="./src/resources/cloudforce-one/requests/priority.ts">PriorityEdit</a></code>
- <code><a href="./src/resources/cloudforce-one/requests/priority.ts">PriorityDeleteResponse</a></code>

Methods:

- <code title="post /accounts/{account_identifier}/cloudforce-one/requests/priority/new">client.cloudforceOne.requests.priority.<a href="./src/resources/cloudforce-one/requests/priority.ts">create</a>(accountIdentifier, { ...params }) -> Priority</code>
- <code title="put /accounts/{account_identifier}/cloudforce-one/requests/priority/{priority_identifer}">client.cloudforceOne.requests.priority.<a href="./src/resources/cloudforce-one/requests/priority.ts">update</a>(accountIdentifier, priorityIdentifer, { ...params }) -> Item</code>
- <code title="delete /accounts/{account_identifier}/cloudforce-one/requests/priority/{priority_identifer}">client.cloudforceOne.requests.priority.<a href="./src/resources/cloudforce-one/requests/priority.ts">delete</a>(accountIdentifier, priorityIdentifer) -> PriorityDeleteResponse</code>
- <code title="get /accounts/{account_identifier}/cloudforce-one/requests/priority/{priority_identifer}">client.cloudforceOne.requests.priority.<a href="./src/resources/cloudforce-one/requests/priority.ts">get</a>(accountIdentifier, priorityIdentifer) -> Item</code>
- <code title="get /accounts/{account_identifier}/cloudforce-one/requests/priority/quota">client.cloudforceOne.requests.priority.<a href="./src/resources/cloudforce-one/requests/priority.ts">quota</a>(accountIdentifier) -> Quota</code>

# EventNotifications

## R2

### Configuration

Types:

- <code><a href="./src/resources/event-notifications/r2/configuration/configuration.ts">ConfigurationGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/event_notifications/r2/{bucket_name}/configuration">client.eventNotifications.r2.configuration.<a href="./src/resources/event-notifications/r2/configuration/configuration.ts">get</a>(bucketName, { ...params }) -> ConfigurationGetResponse</code>

#### Queues

Types:

- <code><a href="./src/resources/event-notifications/r2/configuration/queues.ts">QueueUpdateResponse</a></code>
- <code><a href="./src/resources/event-notifications/r2/configuration/queues.ts">QueueDeleteResponse</a></code>

Methods:

- <code title="put /accounts/{account_id}/event_notifications/r2/{bucket_name}/configuration/queues/{queue_id}">client.eventNotifications.r2.configuration.queues.<a href="./src/resources/event-notifications/r2/configuration/queues.ts">update</a>(bucketName, queueId, { ...params }) -> QueueUpdateResponse</code>
- <code title="delete /accounts/{account_id}/event_notifications/r2/{bucket_name}/configuration/queues/{queue_id}">client.eventNotifications.r2.configuration.queues.<a href="./src/resources/event-notifications/r2/configuration/queues.ts">delete</a>(bucketName, queueId, { ...params }) -> QueueDeleteResponse</code>

# AIGateway

Types:

- <code><a href="./src/resources/ai-gateway/ai-gateway.ts">AIGatewayCreateResponse</a></code>
- <code><a href="./src/resources/ai-gateway/ai-gateway.ts">AIGatewayUpdateResponse</a></code>
- <code><a href="./src/resources/ai-gateway/ai-gateway.ts">AIGatewayListResponse</a></code>
- <code><a href="./src/resources/ai-gateway/ai-gateway.ts">AIGatewayDeleteResponse</a></code>
- <code><a href="./src/resources/ai-gateway/ai-gateway.ts">AIGatewayGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/ai-gateway/gateways">client.aiGateway.<a href="./src/resources/ai-gateway/ai-gateway.ts">create</a>({ ...params }) -> AIGatewayCreateResponse</code>
- <code title="put /accounts/{account_id}/ai-gateway/gateways/{id}">client.aiGateway.<a href="./src/resources/ai-gateway/ai-gateway.ts">update</a>(id, { ...params }) -> AIGatewayUpdateResponse</code>
- <code title="get /accounts/{account_id}/ai-gateway/gateways">client.aiGateway.<a href="./src/resources/ai-gateway/ai-gateway.ts">list</a>({ ...params }) -> AIGatewayListResponsesV4PagePaginationArray</code>
- <code title="delete /accounts/{account_id}/ai-gateway/gateways/{id}">client.aiGateway.<a href="./src/resources/ai-gateway/ai-gateway.ts">delete</a>(id, { ...params }) -> AIGatewayDeleteResponse</code>
- <code title="get /accounts/{account_id}/ai-gateway/gateways/{id}">client.aiGateway.<a href="./src/resources/ai-gateway/ai-gateway.ts">get</a>(id, { ...params }) -> AIGatewayGetResponse</code>

## Logs

Types:

- <code><a href="./src/resources/ai-gateway/logs.ts">LogListResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/ai-gateway/gateways/{id}/logs">client.aiGateway.logs.<a href="./src/resources/ai-gateway/logs.ts">list</a>(id, { ...params }) -> LogListResponsesV4PagePaginationArray</code>

# IAM

## PermissionGroups

Types:

- <code><a href="./src/resources/iam/permission-groups.ts">PermissionGroupListResponse</a></code>
- <code><a href="./src/resources/iam/permission-groups.ts">PermissionGroupGetResponse</a></code>

Methods:

- <code title="get /accounts/{account_id}/iam/permission_groups">client.iam.permissionGroups.<a href="./src/resources/iam/permission-groups.ts">list</a>({ ...params }) -> PermissionGroupListResponsesV4PagePaginationArray</code>
- <code title="get /accounts/{account_id}/iam/permission_groups/{permission_group_id}">client.iam.permissionGroups.<a href="./src/resources/iam/permission-groups.ts">get</a>(permissionGroupId, { ...params }) -> PermissionGroupGetResponse</code>

## ResourceGroups

Types:

- <code><a href="./src/resources/iam/resource-groups.ts">ResourceGroupCreateResponse</a></code>
- <code><a href="./src/resources/iam/resource-groups.ts">ResourceGroupUpdateResponse</a></code>
- <code><a href="./src/resources/iam/resource-groups.ts">ResourceGroupListResponse</a></code>
- <code><a href="./src/resources/iam/resource-groups.ts">ResourceGroupDeleteResponse</a></code>
- <code><a href="./src/resources/iam/resource-groups.ts">ResourceGroupGetResponse</a></code>

Methods:

- <code title="post /accounts/{account_id}/iam/resource_groups">client.iam.resourceGroups.<a href="./src/resources/iam/resource-groups.ts">create</a>({ ...params }) -> ResourceGroupCreateResponse</code>
- <code title="put /accounts/{account_id}/iam/resource_groups/{resource_group_id}">client.iam.resourceGroups.<a href="./src/resources/iam/resource-groups.ts">update</a>(resourceGroupId, { ...params }) -> ResourceGroupUpdateResponse</code>
- <code title="get /accounts/{account_id}/iam/resource_groups">client.iam.resourceGroups.<a href="./src/resources/iam/resource-groups.ts">list</a>({ ...params }) -> ResourceGroupListResponsesV4PagePaginationArray</code>
- <code title="delete /accounts/{account_id}/iam/resource_groups/{resource_group_id}">client.iam.resourceGroups.<a href="./src/resources/iam/resource-groups.ts">delete</a>(resourceGroupId, { ...params }) -> ResourceGroupDeleteResponse | null</code>
- <code title="get /accounts/{account_id}/iam/resource_groups/{resource_group_id}">client.iam.resourceGroups.<a href="./src/resources/iam/resource-groups.ts">get</a>(resourceGroupId, { ...params }) -> ResourceGroupGetResponse</code>

# CloudConnector

## Rules

Types:

- <code><a href="./src/resources/cloud-connector/rules.ts">RuleUpdateResponse</a></code>
- <code><a href="./src/resources/cloud-connector/rules.ts">RuleListResponse</a></code>

Methods:

- <code title="put /zones/{zone_id}/cloud_connector/rules">client.cloudConnector.rules.<a href="./src/resources/cloud-connector/rules.ts">update</a>([ ...body ]) -> RuleUpdateResponse</code>
- <code title="get /zones/{zone_id}/cloud_connector/rules">client.cloudConnector.rules.<a href="./src/resources/cloud-connector/rules.ts">list</a>({ ...params }) -> RuleListResponsesSinglePage</code>
